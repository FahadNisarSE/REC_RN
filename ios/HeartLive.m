//
//  HeartLive.m
//  HeartRateCurve
//
//  Created by IOS－001 on 14-4-23.
//  Copyright (c) 2014年 N/A. All rights reserved.
//

#import "HeartLive.h"

//#define PointContainerMax25   (1536)  ///25mm/s
//#define PointContainerMax50   (768)   ///50mm/s

//#define PointContainerMax   ([[NSUserDefaults standardUserDefaults] integerForKey:Ecg_Time_Base_KEY] == 25 ? 1536: 768 )
#define PointContainerMax   ([[NSUserDefaults standardUserDefaults] integerForKey:Ecg_Time_Base_KEY] == 25 ? 600 : 300 )

//#define PointContainerMax   600

//static const NSInteger kMaxContainerCapacity = PointContainerMax - 36;
#define kMaxContainerCapacity  (PointContainerMax - 36)
///心电走速
#define Ecg_Time_Base_KEY    @"Ecg_Time_Base_KEY"
///心电增益
//#define Ecg_Gain_Key         @"Ecg_Gain_Key"
#define ECG_VIEW_HEIGHT     (175.0)
#define ECG_VIEW_WIDTH      (375.0)


@interface PointContainer ()
@property (nonatomic , assign) NSInteger numberOfRefreshElements;

@property (nonatomic , assign) CGPoint *refreshPointContainer;
@end

@implementation PointContainer

- (void)dealloc
{
    free(self.refreshPointContainer);
    self.refreshPointContainer = NULL;
}

+ (PointContainer *)sharedContainer
{
    static PointContainer *container_ptr = NULL;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        container_ptr = [[self alloc] init];
        ///Allocate a buffer of CGPoint
        container_ptr.refreshPointContainer = malloc(sizeof(CGPoint) * kMaxContainerCapacity);
        memset(container_ptr.refreshPointContainer, 0, sizeof(CGPoint) * kMaxContainerCapacity);
    });
    return container_ptr;
}

- (void)addPointAsRefreshChangeform:(CGPoint)point
{
    static NSInteger currentPointsCount = 0;
    
    if (currentPointsCount < kMaxContainerCapacity) {
        self.numberOfRefreshElements = currentPointsCount + 1;
        self.refreshPointContainer[currentPointsCount] = point;
        currentPointsCount ++;
    } else {
        NSInteger workIndex = 0;
        while (workIndex != kMaxContainerCapacity - 1)
        {
            self.refreshPointContainer[workIndex] = self.refreshPointContainer[workIndex + 1];
            workIndex ++;
        }
        self.refreshPointContainer[kMaxContainerCapacity - 1] = point;
        self.numberOfRefreshElements = kMaxContainerCapacity;
    }
}

@end

#pragma mark -HeartLive
static int j = 0;
static int c = 0;
static int dataSourceCounterIndex = -1;
@interface HeartLive ()
@property (nonatomic, assign) NSInteger currentPointsCount;
@property (nonatomic, strong) NSMutableArray *ecgDataArray;
@property (nonatomic, strong) NSMutableArray *dataSource;
@property(nonatomic, strong) NSTimer         *drawingTimer; //Timer for drawing ECG
@end

@implementation HeartLive

- (NSMutableArray *)ecgDataArray {
    if (_ecgDataArray == nil) {
        _ecgDataArray = [NSMutableArray array];
    }
    return _ecgDataArray;
}

- (NSMutableArray *)dataSource {
    if (_dataSource == nil) {
        _dataSource = [NSMutableArray array];
    }
    return _dataSource;
}

- (void)setPoints:(CGPoint *)points
{
    _points = points;
    [self setNeedsDisplay];
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setBackgroundColor:[UIColor clearColor]];
        self.clearsContextBeforeDrawing = YES;
        [[NSUserDefaults standardUserDefaults] setInteger:25 forKey:Ecg_Time_Base_KEY];
    }
    return self;
}


- (void)fireDrawingWithPoints:(CGPoint *)points pointsCount:(NSInteger)count
{
    self.currentPointsCount = count;
    self.points = points;
}

-(void)drawBackground
{
    ///Draw background grid
    CGFloat width = self.bounds.size.width;
    CGFloat height = self.bounds.size.height;
    ///Draw background image
    UIBezierPath *path = [UIBezierPath bezierPath];
    CGFloat x = 0, y = 0;
    for(int i = 0; i <= width / 5; i++)
    {
        [path moveToPoint:CGPointMake(x, 0)];
        [path addLineToPoint:CGPointMake(x, height)];
        x += 5;
    }
    for(int i = 0; i <= height / 5; i++)
    {
        [path moveToPoint:CGPointMake(0, y)];
        [path addLineToPoint:CGPointMake(width, y)];
        y += 5;
    }
    [path setLineWidth:1];
    [[UIColor colorWithRed:0xDD/255.0 green:0xDD/255.0 blue:0xDD/255.0 alpha:1] set];
    [path stroke];
    [path closePath];
    path = nil;
    
    ///Draw a line with a thick background
    path = [UIBezierPath bezierPath];
    x = 0;
    y = 0;
    for(int i = 0; i <= width / 25; i++)
    {
        [path moveToPoint:CGPointMake(x, 0)];
        [path addLineToPoint:CGPointMake(x, height)];
        x += 25;
    }
    for(int i = 0; i <= height / 25; i++)
    {
        [path moveToPoint:CGPointMake(0, y)];
        [path addLineToPoint:CGPointMake(width, y)];
        y += 25;
    }
    [path setLineWidth:2];
    [[UIColor colorWithRed:0xDD/255.0 green:0xDD/255.0 blue:0xDD/255.0 alpha:1] set];
    [path stroke];
    [path closePath];
    path = nil;
}

- (void)drawCurve
{
    if (self.currentPointsCount == 0) {
        return;
    }
    CGFloat curveLineWidth = 1;
    CGContextRef currentContext = UIGraphicsGetCurrentContext();
    CGContextSetLineWidth(currentContext, curveLineWidth);
  CGContextSetStrokeColorWithColor(UIGraphicsGetCurrentContext(), HBColor(30, 193, 129).CGColor);
    CGContextSetLineCap(currentContext, kCGLineCapRound);      //The head and tail of the line are arc-shaped
    CGContextSetLineJoin(currentContext, kCGLineJoinRound);    //The curve of the line is arc-shaped
    CGContextMoveToPoint(currentContext, self.points[0].x, self.points[0].y);
    for (int i = 1; i != self.currentPointsCount; ++i)
    {
        if (self.points[i - 1].x < self.points[i].x)
        {
            CGContextAddLineToPoint(currentContext, self.points[i].x, self.points[i].y);
        }
        else
        {
            CGContextMoveToPoint(currentContext, self.points[i].x, self.points[i].y);
        }
    }
  CGContextStrokePath(currentContext);
}

- (void)drawRect:(CGRect)rect
{
    // Drawing code
    [self drawBackground];
    [self drawCurve];
}



- (void)addEcgData:(int)data
{
    if (self.ecgDataArray.count < PointContainerMax - 1) {
        [self.ecgDataArray addObject:[NSString stringWithFormat:@"%d", data]];
    }else {
        [self.ecgDataArray removeAllObjects];
    }
}

-(void)startDrawingEcgView
{
    c = 0;
    j = 0;
    [self.dataSource removeAllObjects];
    [self.ecgDataArray removeAllObjects];
    
    ///Start timer
//    _drawingTimer = [NSTimer  scheduledTimerWithTimeInterval:0.002f target:self selector:@selector(drawing) userInfo:nil repeats:YES];
//    [[NSRunLoop mainRunLoop] addTimer:_drawingTimer forMode:NSRunLoopCommonModes];
    _drawingTimer = [NSTimer  scheduledTimerWithTimeInterval:0.002f target:self selector:@selector(drawing) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop] addTimer:_drawingTimer forMode:NSRunLoopCommonModes];
}

-(void)stopDrawingEcgView
{
    if (_drawingTimer.isValid) {
        [_drawingTimer invalidate];
    }
    _drawingTimer = nil;
    ///Clear buffer
//    self.currentPointsCount = 0;
    [self.dataSource removeAllObjects];
    [self.ecgDataArray removeAllObjects];
//    [self setNeedsDisplay];
}

- (void)drawing {
    if (j <= PointContainerMax - 1) {
        if (self.ecgDataArray.count > 5) {
            for (int i = 0; i < 5; i ++) {
                j++;
                [self.dataSource addObject: self.ecgDataArray[i]];
            }
        }
    }
    else
    {
        if (self.ecgDataArray.count > 5) {
            for (int i = 0; i < 5; i ++) {
                [self.dataSource replaceObjectAtIndex:c withObject:self.ecgDataArray[i]];
                
                ///Convert the data into x and y values and put them into the drawing buffer
                [[PointContainer sharedContainer] addPointAsRefreshChangeform:[self bubbleRefreshPoint]];
                
                [self fireDrawingWithPoints:[PointContainer sharedContainer].refreshPointContainer pointsCount:[PointContainer sharedContainer].numberOfRefreshElements];
                c++;
            }
        }
        if (c >= PointContainerMax - 1)
        {
            c = 0;
            [self.ecgDataArray removeAllObjects];
        }
    }
    ///Remove added data from ecgDataArray
    self.ecgDataArray = [self modifyTheArray:self.ecgDataArray];
}

- (NSMutableArray *)modifyTheArray:(NSMutableArray *)array1 {
    if (array1.count > 5) {
        
        for (int i = 0; i < 5; i ++) {
            [array1 removeObjectAtIndex:0];
        }
        return array1;
    }else{
        return array1;
    }
}

///Calculate Point based on current data
///(float) (mViewHeight / 2 + data * 18.3 / 128 * xS / 100 * gain.getScale());
- (CGPoint)bubbleRefreshPoint {
    dataSourceCounterIndex ++;
    dataSourceCounterIndex %= [self.dataSource count];
    int heartValue;

    heartValue = [self.dataSource[dataSourceCounterIndex] intValue];

    CGFloat mv = (heartValue * 12.247 / 9.5 / 8 / 1000) * 2;
    ///Gain is 10mm/mv,
    CGFloat Y = (ECG_VIEW_HEIGHT / 2) + mv / 4 * ECG_VIEW_HEIGHT;
    ///The sampling rate is 512 and the traveling speed is 25mm/s.
    CGFloat X = dataSourceCounterIndex * ECG_VIEW_WIDTH / PointContainerMax;
//    NSLog(@"%f",X);
    CGPoint targetPointToAdd = CGPointMake(X, Y);
 
    return targetPointToAdd;
}



@end

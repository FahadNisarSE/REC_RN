//
//  SPView.m
//  StockPlotting
//
//  Created by EZ on 13-11-5.
//  Copyright (c) 2013年 cactus. All rights reserved.
//
#define NLSystemVersionGreaterOrEqualThan(version)  ([[[UIDevice currentDevice] systemVersion] floatValue] >= version)
#define IOS7_OR_LATER   NLSystemVersionGreaterOrEqualThan(7.0)
#define GraphColor      [[UIColor greenColor] colorWithAlphaComponent:0.5]


#import "SPView.h"
@interface SPView ()
@property (nonatomic,strong)   dispatch_source_t timer;
@property (nonatomic,assign) CGFloat kXScale,kYScale;

@end
@implementation SPView

const double    nextValue = 0.0;

static inline CGAffineTransform

CGAffineTransformMakeScaleTranslate(CGFloat sx, CGFloat sy,
    CGFloat dx, CGFloat dy)
{
    return CGAffineTransformMake(sx, 0.f, 0.f, sy, dx, dy);
}

- (id)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self initializeUI];
    }
    return self;
}

- (void) setXSpeed:(int) xSpeed andYheight:(int) yHeight andYMaxVal:(CGFloat) maxVal
{
//    32767 peak
    self.kXScale = xSpeed/25.0 * 2.0;
    self.kYScale = yHeight/10.0 * 0.5;
    self.maxVal = maxVal;
}


- (void)awakeFromNib
{
    [self setContentMode:UIViewContentModeRight];
    [self initializeUI];
}

- (void)initializeUI {
    _values = [NSMutableArray array];
    self.backgroundColor = [UIColor clearColor];
}


- (void)updateValues:(NSNumber *)next
{
    double nextValue = [next floatValue];
//    NSLog(@"nextValue:%g",nextValue);
    
    nextValue *= 5;
    nextValue = nextValue/self.maxVal;
    nextValue = nextValue*self.frame.size.height/2 ;
    
    if (self.values.count>600)
    {
        [self.values removeObject:0];
    }
    [self.values addObject:
    [NSNumber numberWithDouble:nextValue]];
    
    CGSize size = self.bounds.size;

 
    CGFloat     maxDimension = size.width; // MAX(size.height, size.width);
//    NSUInteger  maxValues =
//        (NSUInteger)floorl(maxDimension / self.kXScale);

    NSUInteger  maxValues =
    (NSUInteger)ceil(maxDimension / self.kXScale);
    
    if ([self.values count] > maxValues) {
        [self.values removeObjectsInRange:
        NSMakeRange(0, [self.values count] - maxValues)];
    }
    
    [self setNeedsDisplay];
}

- (void)dealloc
{
    //dispatch_source_cancel(_timer);
}

- (void)drawRect:(CGRect)rect
{
    if ([self.values count] == 0) {
        return;
    }

    CGContextRef ctx = UIGraphicsGetCurrentContext();
    
    CGContextClearRect(ctx, CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height));
    CGContextSetStrokeColorWithColor(ctx,
        [GraphColor CGColor]);

    CGContextSetLineJoin(ctx, kCGLineJoinRound);
    CGContextSetLineWidth(ctx, 2);

    CGMutablePathRef path = CGPathCreateMutable();

    CGFloat             yOffset = self.bounds.size.height / 2;
    CGAffineTransform   transform =
        CGAffineTransformMakeScaleTranslate(self.kXScale, self.kYScale,
            0, yOffset);
    CGPathMoveToPoint(path, &transform, 0, 0);
//    CGPathAddLineToPoint(path, &transform, self.bounds.size.width, 0); // self.bounds.size.width其实大了kXScale倍  画中间的横线

    CGFloat y = [[self.values objectAtIndex:0] floatValue];
    CGPathMoveToPoint(path, &transform, 0, y);

    for (NSUInteger x = 0; x < self.values.count; ++x) {
        y = [[self.values objectAtIndex:x] floatValue];
        CGPathAddLineToPoint(path, &transform, x, y);
    }

    
    CGContextAddPath(ctx, path);
    CGPathRelease(path);
    CGContextStrokePath(ctx);
}

- (void)drawAtPoint:(CGPoint)point withStr:(NSString *)str
{
    
    if (IOS7_OR_LATER) {
       #if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_6_1
        [str drawAtPoint:point withAttributes:@{NSStrokeColorAttributeName:GraphColor}];
       #endif
    } else {
        [str drawAtPoint:point withFont:[UIFont systemFontOfSize:0]];
        
        
    }
     
}



@end

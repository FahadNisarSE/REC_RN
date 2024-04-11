//
//  oxyWaveView.m
//  MinttiVision
//
//  Created by 徐兴国 on 2020/5/9.
//  Copyright © 2020 徐兴国. All rights reserved.
//

#import "OxyWaveView.h"

static inline CGAffineTransform CGAffineTransformMakeScaleTranslate(CGFloat sx, CGFloat sy,
    CGFloat dx, CGFloat dy)
{
    return CGAffineTransformMake(sx, 0.f, 0.f, sy, dx, dy);
}
#define MinttiThemeColor [UIColor colorWithRed:68/255.0 green:188/255.0 blue:177/255.0 alpha:1.0]

@interface OxyWaveView ()
@property (nonatomic,assign)    CGFloat kXScale,kYScale;
@property (nonatomic, strong)   NSMutableArray *pointValues;
@end

@implementation OxyWaveView

-(NSMutableArray *)pointValues
{
    if(_pointValues == nil)
    {
        _pointValues = [[NSMutableArray alloc] init];
    }
    return _pointValues;
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setupSubViews];
    }
    return self;
}

-(instancetype)init{
    self = [super init];
    if (self) {
        [self setupSubViews];
    }
    
    return self;
}
    
-(void)setupSubViews{
    [self setContentMode:UIViewContentModeRight];
    self.backgroundColor = [UIColor clearColor];
    self.layer.borderColor = MinttiThemeColor.CGColor;
    self.layer.borderWidth = 1;
}

- (void)setXSpeed:(int) xSpeed andYheight:(int) yHeight andYMaxVal:(CGFloat) maxVal
{
//    32767峰值
    self.kXScale = xSpeed / 25.0 * 2.0;
    self.kYScale = yHeight / 5.0 * 0.5;
    self.maxVal = maxVal;
}

- (void)updateValues:(NSNumber *)next
{
//    NSLog(@"%@",next);
    double nextValue = [next doubleValue];
    
//    nextValue *= 5;
//    nextValue = nextValue / self.maxVal;
//    nextValue = nextValue * self.frame.size.height/2 ;
    
    if (self.pointValues.count > 600)
    {
        [self.pointValues removeObjectAtIndex:0];
    }
//    NSLog(@"%f",nextValue);
    [self.pointValues addObject:[NSNumber numberWithDouble:nextValue]];
    
    CGSize size = self.bounds.size;

    CGFloat     maxDimension = size.width;
    NSUInteger  maxValues    = (NSUInteger)ceil(maxDimension / self.kXScale);
    
    if ([self.pointValues count] > maxValues) {
        [self.pointValues removeObjectsInRange:NSMakeRange(0, [self.pointValues count] - maxValues)];
    }
    
    [self setNeedsDisplay];
}

- (void)drawRect:(CGRect)rect
{
    if ([self.pointValues count] == 0) {
        return;
    }

    CGContextRef ctx = UIGraphicsGetCurrentContext();
    
    CGContextClearRect(ctx, CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height));
    CGContextSetStrokeColorWithColor(ctx, [GraphColor CGColor]);

    CGContextSetLineJoin(ctx, kCGLineJoinRound);
    CGContextSetLineWidth(ctx, 2);

    CGMutablePathRef path = CGPathCreateMutable();

    CGFloat              yOffset = self.bounds.size.height / 2;
    CGAffineTransform  transform = CGAffineTransformMakeScaleTranslate(self.kXScale, 0.3,0, yOffset);
    
    CGPathMoveToPoint(path, &transform, 0, 0);

    CGFloat y = [[self.pointValues objectAtIndex:0] floatValue];
    CGPathMoveToPoint(path, &transform, 0, y);
//    NSLog(@"y - %f ;kYScale - %f maxVal -- %f",y, self.kYScale,self.maxVal);
    for (NSUInteger x = 0; x < self.pointValues.count; ++x) {
        y = [[self.pointValues objectAtIndex:x] floatValue];
        CGPathAddLineToPoint(path, &transform, x, y);
    }

    CGContextAddPath(ctx, path);
    CGPathRelease(path);
    CGContextStrokePath(ctx);
}


@end

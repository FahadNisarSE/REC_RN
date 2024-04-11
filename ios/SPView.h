//
//  SPView.h
//  StockPlotting
//
//  Created by EZ on 13-11-5.
//  Copyright (c) 2013年 cactus. All rights reserved.
//  ecg绘图控件

#import <UIKit/UIKit.h>

@interface SPView : UIView
@property (nonatomic, readonly, strong) NSMutableArray *values;
@property (nonatomic,assign) CGFloat maxVal;
- (void)updateValues:(NSNumber *)next;
- (void) setXSpeed:(int) xSpeed andYheight:(int) yHeight andYMaxVal:(CGFloat) maxVal;
@end

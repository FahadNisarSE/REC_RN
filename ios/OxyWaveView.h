//
//  oxyWaveView.h
//  MinttiVision
//
//  Created by 徐兴国 on 2020/5/9.
//  Copyright © 2020 徐兴国. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

#define GraphColor      [[UIColor greenColor] colorWithAlphaComponent:0.5]

@interface OxyWaveView : UIView
@property (nonatomic, readonly, strong) NSMutableArray *values;
@property (nonatomic,assign)    CGFloat maxVal;
- (void)updateValues:(NSNumber *)next;
- (void) setXSpeed:(int) xSpeed andYheight:(int) yHeight andYMaxVal:(CGFloat) maxVal;
@end

NS_ASSUME_NONNULL_END

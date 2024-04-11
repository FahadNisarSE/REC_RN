//
//  HeartLive.h
//  HeartRateCurve
//
//  Created by IOS－001 on 14-4-23.
//  Copyright (c) 2014年 N/A. All rights reserved.
//

#import <UIKit/UIKit.h>

//#define BRUSH_SIZE 32
// 设置颜色
#define HBColor(r, g, b) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:1.0]
#define HBScreenW [UIScreen mainScreen].bounds.size.width
#define HBScreenH [UIScreen mainScreen].bounds.size.height
#define HWScale (130.0/400.0)  // ecg展示背景的宽高比

@interface PointContainer : NSObject

@property (nonatomic , readonly) NSInteger numberOfRefreshElements;

@property (nonatomic , readonly) CGPoint *refreshPointContainer;

+ (PointContainer *)sharedContainer;

//刷新变换
- (void)addPointAsRefreshChangeform:(CGPoint)point;

@end



@interface HeartLive : UIView

@property (nonatomic, assign) CGPoint *points;

- (void)addEcgData:(int)data;
-(void)startDrawingEcgView;
-(void)stopDrawingEcgView;
@end


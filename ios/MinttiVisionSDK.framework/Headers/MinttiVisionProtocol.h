//
//  MinttiVisionProtocol.h
//  MinttiVisionDemo
//
//  Created by 徐兴国 on 2021/4/20.
//  Copyright © 2021 盛海波. All rights reserved.
//

#import <Foundation/Foundation.h>

@class MinttiVisionProtocol;

@protocol VisionProtocolDeleagte <NSObject>





/**
 *@temValue             Body temperature data 体温数据
 *@blackBodyValue       Blackbody temperature 黑体温度
 *@ambientValue         ambient temperature   环境温度
 *
 *Return temperature value
 *抛出体温模块数据
*/
- (void)receiveMTTemDataValue:(double)temValue andBlackBody:(double)blackBodyValue andAmbient :(double)ambientValue;

/**
 *@oxyValue  Blood oxygen raw data      血氧原始数据
 *
 *Return Blood oxygen value
 *抛出心电模块数据
*/
- (void)receiveMTOxyDataValue:(int)oxyValue;

/**
 *@oxyResult  blood oxygen value        血氧算法结果
 *@heartRate    heartRate valeue        心率算法结果
 *
 *Results of blood oxygen algorithm
 *抛出血氧算法结果
*/
- (void)receiveMTOxyDataResult:(double)oxyResult andHeartRate:(int)heartRate;



/**
 *@sugCode  Blood glucose status code   血糖状态码
 *
 *IDLE_STATUS     = 0x00,
 *INSERT_STATUS    = 0x01,
 *WAIT_DRIP_STATUS   = 0x02,                等待滴入血液
 *DRIP_BLOOD_STATUS   = 0x03,               以获取到血液
 *CALIBRATION_OVER_STATUS  = 0x04,          校准结束
 *MEASURE_OVER_STATUS   = 0x05,             测量结束
 *PAPER_USED_STATUS   = 0x06,               试纸已被使用
 *PAPAER_PULL_OUT_STATUS  = 0x07,
 *WAIT_INSERT_STATUS   = 0x08,              等待插入血糖试纸
 *VERIFICATION_ERROR_STATUS   = 0x09,       验证错误
 *
 *Return Blood glucose status code
 *抛出血糖测试状态
*/
- (void)receiveMTSugDataCode:(int)sugCode;

/**
 *@sugValue  Blood glucose measurement      血糖测量值
 *
 *Return Blood glucose measurement
 *抛出血糖测量值
*/
- (void)receiveMTSugDataValue:(double)sugValue;

/**
 *@diastolicValue  compression value        加压数据
 *
 *Return compression value
 *抛出加压数据
*/
- (void)receiveMTPreCompressionData:(int)compressionValue;

/**
 *@systolicValue  decompression value       减压数据
 *
 *Return decompression value
 *抛出减压数据
*/
- (void)receiveMTPreDecompressionData:(int)decompressionValue;

/**
 *Blood pressure measurement error
 *
 *Return pressure measurement error
 *抛出漏气错误
*/
- (void)receiveBpLeakError;

/**
 *@systolicValue    systolic pressure value     收缩压
 *@diastolic        diastolic pressure value    舒张压
 *@hr               heart rate                  心率
 *
 *Return Blood pressure algorithm data
 *抛出血压算法数据
*/
- (void)receiveMTBPSystolicValue : (int)systolicValue andDiastolic:(int)diastolic andHr:(int)hr;


/**
 *Blood pressure measurement error
 *
 *Return pressure measurement error
 *抛出测量错误
*/
- (void)receiveBpMeaureError;

/**
 *@smoothedWave        ECG raw data 心电原始数据
 *
 *Return ECG value
 *抛出心电模块数据
*/
- (void)receiveMTECGDataSmoothedWave:(int)smoothedWave;

/**
 *@HeartRate  Respiratory rate      呼吸率
 *
 *Return Respiratory rate
 *抛出呼吸率
*/
- (void)receiveRespiratoryRate:(int)respiratoryRate;

/**
 *@RRIMax  RRIMax
 *
 *Return RRIMax
 *抛出RRIMax
*/
- (void)receiveRRIMax:(double)RRIMax;

/**
 *@RRIMin  RRIMin
 *
 *Return RRIMin
 *抛出RRIMin
*/
- (void)receiveRRIMin:(double)RRIMin;

/**
 *@AvrHr  average heart rate    平均心率
 *
 *Return average heart rate value
 *抛出平均心率
*/
- (void)receiveAvrHr:(int)AvrHr;

/**
 *@SDNN  SDNN       心率变异性
 *
 *Return SDNN
 *抛出心率变异性
*/
- (void)receiveSDNN:(double)SDNN;

/**
 *@batteryValue  battery level value            电池电量数据
 *
 *Return battery level value
 *抛出电池电量数据
*/
- (void)receiveBatteryValue:(NSData *)batteryValue;

/**
 *@versionNumber  version number                设备版本号数据
 *
 *Return version number
 *抛出设备版本号数据
*/
- (void)receiveVersionNumber:(Byte *)versionNumber;

/**@eqManufacturer  equipment manufacturer      设备厂商数据
 *
 *Return equipment manufacturer
 *抛出设备厂商数据
*/
- (void)receiveEqManufacturer:(Byte *)eqManufacturer;
- (void)receiveSerialNumber:(Byte *)serialNumber;

/**血氧测量结束*/

- (void)receiveECGEnd;

- (void)receiveOxyEnd;

@end

typedef void(^preEndAciton)(int,int);
typedef void(^sugCodeAciton)(BOOL);
@interface MinttiVisionProtocol : NSObject

@property (nonatomic, weak) id<VisionProtocolDeleagte> delegate;

- (void)resetVisionProtocol;
- (void)longHandleData:(Byte *)rawData; //连续数据
- (void)BGHandleData:(Byte *)rawData; //血糖数据
- (void)TemHandleData:(Byte *)rawData; //体温数据

-(void)startECG;
-(void)endECG;
-(void)startOxy;
-(void)endOxy;

- (void)sendBatteryValue:(NSData *)batteryValue; //电池电量数据
- (void)sendVersionNumber:(Byte *)versionNumber; //设备版本号数据
- (void)sendEqManufacturer:(Byte *)eqManufacturer; //设备厂商数据

- (void)sendSerialNumber:(Byte*)serialNumber;

@property(copy, nonatomic) preEndAciton endPreBlock;
@property(strong, nonatomic) sugCodeAciton sugCodeBlock;//血糖校验

@property(nonatomic, assign) int HeartRate;//40秒内没有算出呼吸率继续测量，最长时间60秒
//@property(nonatomic, assign) ECGParam *ecgParam;//心电算法
@end



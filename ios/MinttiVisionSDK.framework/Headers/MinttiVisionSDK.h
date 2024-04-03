//
//  MinttiVisionSDK.h
//  MinttiVisionDemo
//
//  Created by 徐兴国 on 2021/4/23.
//  Copyright © 2021 盛海波. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "MinttiVisionProtocol.h"

@interface MinttiVisionSDK : NSObject
@property(nonatomic ,strong) MinttiVisionProtocol *visionMTProtocol;
/**
 初始化实例 单例
 */
+ (MinttiVisionSDK *)sharedVisionSDK;
/**
 *start SDK
 *启动SDK
*/
-(void)scanStart;

/**
 *stop SDK
 *关闭SDK
*/
-(void)scanStop;

/**
 *SDK connect BlueTooth
 *SDK连接蓝牙设备
*/
-(void)connectBlueTooth:(CBPeripheral*)peripheral;

/**
 *SDK disconnect BlueTooth
 *SDK断连蓝牙设备
*/
-(void)disconnectBlueTooth:(CBPeripheral*)peripheral;


/**
 *SDK Start temperature measurement
 *SDK启动体温测量
*/
-(void)startThermometerTest;
/**
 *SDK End temperature measurement
 *SDK关闭体温测量
*/
-(void)endThermometerTest;

/**
 *SDK Start blood oxygen measurement
 *SDK启动血氧测量
*/
-(void)startOximetryTest;

/**
 *SDK End blood oxygen measurement
 *SDK结束血氧测量
*/
-(void)endOximetryTest;

/**
 *SDK Start blood pressure measurement
 *SDK启动血压测量
*/
-(void)startBloodPressure;

/**
 *SDK End blood pressure measurement
 *SDK结束血压测量
*/
-(void)endBloodPressure;

/**
 *SDK Start ECG measurement
 *SDK启动心电测量
*/
-(void)startECG;

/**
 *SDK End ECG measurement
 *SDK结束心电测量
*/
-(void)endECG;

/**
 *SDK Start blood sugar measurement
 *SDK启动血糖测量
*/
-(void)startBloodSugar;

/**
 *SDK End blood sugar measurement
 *SDK结束血糖测量
*/
-(void)endBloodSugar;

-(void)writeSerialNumber:(NSString*)serialNumber;

-(void)getSerialNumber;

@end


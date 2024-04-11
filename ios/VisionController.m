#import "VisionController.h"
#import <React/RCTLog.h>
#import <MinttiVisionSDK/MinttiVisionSDK.h>
#import "CBPeripheralModel.h"

@interface VisionController ()
@property (strong, nonatomic) CBCentralManager *centralManager;
@property(nonatomic ,strong) MinttiVisionSDK *visionMTSDK;
@property(nonatomic ,strong) MinttiVisionProtocol *visionMTProtocol;
@property(nonatomic ,strong) NSNumber *batteryLevel;
@property(strong, nonatomic) NSMutableArray *peripheralModels;
@end

@implementation VisionController

RCT_EXPORT_MODULE(VisionModule);

- (instancetype)init {
  self = [super init];
  self.batteryLevel = 0;
  if (self) {
    _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil options:nil];
    self.centralManager.delegate = self;
    _visionMTProtocol = [[MinttiVisionProtocol alloc] init];
    _visionMTProtocol.delegate = self;
    
    _visionMTSDK = [MinttiVisionSDK sharedVisionSDK];
    _visionMTSDK.visionMTProtocol =_visionMTProtocol;
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onScanResult",@"onDisconnected", @"onEcg",@"onEcgHeartRate",@"onEcgRespiratoryRate",@"onEcgResult",@"onEcgDuration",@"onBgEvent",@"onBgResult",@"onSpo2",@"onSpo2Result",@"onSpo2Ended",@"onBp",@"onBpRaw",@"onBodyTemperatureResult",@"onBattery"]; // Define the list of events this module can emit
}

RCT_EXPORT_METHOD(startDeviceScan) {
  RCTLogInfo(@"Starting device scan...");
  [self.visionMTSDK scanStart];
  [_centralManager scanForPeripheralsWithServices:nil options:nil];
}

RCT_EXPORT_METHOD(stopScan) {
  RCTLogInfo(@"Stop device scan...");
  [self.visionMTSDK scanStop];
}
RCT_EXPORT_METHOD(connectToDevice:(NSDictionary *)device resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"Connecting..");
  
//  NSDictionary *options = @{CBCentralManagerScanOptionAllowDuplicatesKey : @NO};
//  NSArray *uuidArray = @[[CBUUID UUIDWithString:@"1802"]];
//  [self.centralManager scanForPeripheralsWithServices:nil options:options];
//  [self.centralManager retrieveConnectedPeripheralsWithServices:uuidArray];
//  [self.visionMTSDK scanStart];
  CBPeripheral *foundPeripheral = [self findPeripheralModelByName:device[@""]];
  if (foundPeripheral) {
    [self.centralManager connectPeripheral:foundPeripheral options:nil];
  } else {
      NSLog(@"Peripheral not found");
  }

  
  resolve(@"connecting");
}
RCT_EXPORT_METHOD(measureECG) {
  [self.visionMTSDK startECG];
}
RCT_EXPORT_METHOD(stopECG) {
  [self.visionMTSDK endECG];
}
RCT_EXPORT_METHOD(stopBp) {
  [self.visionMTSDK endBloodPressure];
}

//RCT_EXPORT_METHOD(setTestPaper:(NSString *)manufacturer testPaperCode:(NSString *)testPaperCode) {
//  [self.visionMTSDK endBloodPressure];
//}
RCT_EXPORT_METHOD(measureBloodGlucose) {
  [self.visionMTSDK startBloodSugar];
}
RCT_EXPORT_METHOD(measureBloodOxygenSaturation) {
  [self.visionMTSDK startOximetryTest];
}
RCT_EXPORT_METHOD(measureBloodPressure) {
  [self.visionMTSDK startBloodPressure];
}
RCT_EXPORT_METHOD(measureBodyTemperature: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self.visionMTSDK startThermometerTest];
  NSLog(@"starting mesuring");
  resolve(0);
}
RCT_EXPORT_METHOD(getBattery: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(self.batteryLevel);
}



#pragma mark - CBCentralManagerDelegate

//EVENT LISTENERS

- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral{
    NSLog(@"connection succeeded");
    [self.centralManager stopScan];
    [self.visionMTSDK connectBlueTooth:peripheral];
}
- (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(nullable NSError *)error{
    NSLog(@"Disconnected from device");
  [self sendEventWithName:@"onDisconnected" body:@{@"message": @"Device is disconnected"}];
}


- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
  // Handle updates to the central manager's state
}


- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary<NSString *,id> *)advertisementData RSSI:(NSNumber *)RSSI {
  // Handle discovery of peripherals
  if([peripheral.name hasPrefix:@"Mintti-Vision"])
  {
    [self sendEventWithName:@"onScanResult" body:@{@"name": peripheral.name ?: @"", @"rssi": RSSI, @"mac":peripheral.identifier, @"bluetoothDevice": @{@"address":peripheral.identifier, @"bondState":@"disconnected", @"name":peripheral.name }}];
    NSLog(@"Scan to device %@", peripheral);
    if(_peripheralModels == nil)
    {
        _peripheralModels = [[NSMutableArray alloc] init];
    }
    [self.peripheralModels addObject:peripheral];
    [self.peripheralModels addObject:peripheral];
  }
}

//SDK Listenrs
-(void)receiveMTECGDataSmoothedWave:(int)smoothedWave{ //Get SDK ECG data
  [self sendEventWithName:@"onEcg" body:@{@"wave": @(smoothedWave)}];
}
-(void)receiveMTOxyDataResult:(double)oxyResult andHeartRate:(int)heartRate{//Throw blood oxygen algorithm results
  [self sendEventWithName:@"onSpo2Result" body:@{@"result": @{@"heartRate": @(heartRate), @"spo2":@(oxyResult)}}];
}
//** SDK血oxygen  ***/
-(void)receiveMTOxyDataValue:(int)oxyValue{ //Get SDK blood oxygen data
  [self sendEventWithName:@"onSpo2" body:@{@"waveData": @(oxyValue)}];
}

/**Blood oxygen measurement ends*/
- (void)receiveOxyEnd{
  [self sendEventWithName:@"onSpo2Ended" body:@{@"measurementEnded": @true, @"message": @"Spo2 measurement ended"}];
}
/**
 *throw breathing rate
*/
- (void)receiveRespiratoryRate:(int)respiratoryRate{
  [self sendEventWithName:@"onEcgRespiratoryRate" body:@{@"respiratoryRate": @(respiratoryRate)}];
}
/**
 *@RRIMax  RRIMax
 *
 *Return RRIMax
 *ThrowRRIMax
*/
- (void)receiveRRIMax:(double)RRIMax{
  [self sendEventWithName:@"onEcgResult" body:@{@"results": @{@"rrMax": @(RRIMax)}}];
}

/**
 *@RRIMin  RRIMin
 *
 *Return RRIMin
 *ThrowRRIMin
*/
- (void)receiveRRIMin:(double)RRIMin{
  [self sendEventWithName:@"onEcgResult" body:@{@"results": @{@"rrMin": @(RRIMin)}}];
}

/**
 *@AvrHr  average heart rate
 *
 *Return average heart rate value
 *throw average heart rate
*/
- (void)receiveAvrHr:(int)AvrHr{
  [self sendEventWithName:@"onEcgResult" body:@{@"results": @{@"hrv": @(AvrHr)}}];
}
/**
 *@SDNN  SDNN       heart rate variability
 *
 *Return SDNN
 *throw heart rate variability
*/
- (void)receiveSDNN:(double)SDNN{
  [self sendEventWithName:@"onEcgDuration" body:@{@"duration": @{@"duration": @(SDNN)}}];
}

//** SDK body temperature ***/
-(void)receiveMTTemDataValue:(double)temValue andBlackBody:(double)blackBodyValue andAmbient:(double)ambientValue{ //Get SDK body temperature data
  NSLog(@"TEMPERATURE:", temValue);
  [self sendEventWithName:@"onBodyTemperatureResult" body:@{@"bodyTemperature": @(temValue)}];
}


//** SDKblood sugar  ***/
//IDLE_STATUS     = 0x00,
//INSERT_STATUS    = 0x01,
//WAIT_DRIP_STATUS   = 0x02,
//DRIP_BLOOD_STATUS   = 0x03,
//CALIBRATION_OVER_STATUS  = 0x04,
//MEASURE_OVER_STATUS   = 0x05,
//PAPER_USED_STATUS   = 0x06,
//PAPAER_PULL_OUT_STATUS  = 0x07,
//WAIT_INSERT_STATUS   = 0x08,
//VERIFICATION_ERROR_STATUS   = 0x09,
-(void)receiveMTSugDataCode:(int)sugCode{//Throw blood glucose test status
    NSLog(@"sugCode == %d",sugCode);
    
    switch (sugCode) {
        case 0x09:
//            _measureSugViewController.sugLbl.text = @"Calibration failed, please measure again";
            break;
        case 0x08:
//            _measureSugViewController.sugLbl.text = @"Waiting to insert blood glucose test strip";
            break;
        case 0x07:
//            _measureSugViewController.sugLbl.text = @"The blood glucose test strip was pulled out";
            break;
        case 0x06:
//            _measureSugViewController.sugLbl.text = @"Blood glucose test strips have been used";
            break;
        case 0x05:
//            _measureSugViewController.sugLbl.text = @"Measurement ended";
            break;
        case 0x04:
//            _measureSugViewController.sugLbl.text = @"Calibration ended";
            break;
        case 0x03:
//            _measureSugViewController.sugLbl.text = @"to get blood";
            break;
        case 0x02:
//            _measureSugViewController.sugLbl.text = @"Waiting for dripping blood";
            break;
        case 0x01:
//            _measureSugViewController.sugLbl.text = @"Blood glucose test strip has been inserted";
            break;
        case 0x00:
//            _measureSugViewController.sugLbl.text = @"Waiting to insert blood glucose test strip";
            break;
        default:
            break;
    }
}

//** SDK blood pressure  ***/
- (void)receiveMTPreCompressionData:(int)compressionValue{//Throw pressurized data
  [self sendEventWithName:@"onBpRaw" body:@{@"pressurizationData": @(compressionValue)}];
}

- (void)receiveMTPreDecompressionData:(int)decompressionValue{//Throw decompression data
  [self sendEventWithName:@"onBpRaw" body:@{@"decompressionData": @(decompressionValue)}];
}

- (void)receiveMTBPSystolicValue : (int)systolicValue andDiastolic:(int)diastolic andHr:(int)hr{//Throw blood pressure algorithm data
  [self sendEventWithName:@"onBp" body:@{@"result": @{@"systolic": @(systolicValue), @"diastolic": @(diastolic), @"heartRate": @(hr)}}];
}

- (void)receiveBpLeakError{
  [self sendEventWithName:@"onBp" body:@{@"error": @"Air leakage is detected, please check the air circuit and remeasure"}];
    [self.visionMTSDK endBloodPressure];
}

- (void)receiveBatteryValue:(NSData *)batteryValue{ //Battery power data
  self.batteryLevel = batteryValue;
  NSLog(@"batteryLevel", batteryValue);
  [self sendEventWithName:@"onBattery" body:@{@"battery": batteryValue}];
}





#pragma mark - CBPeripheralDelegate

// Implement required peripheral delegate methods here...

#pragma mark - VisionProtocolDelegate

// Implement required vision protocol delegate methods here...


//helper
// Method to find a peripheral model by name
- (CBPeripheral *)findPeripheralModelByName:(NSString *)name {
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"name == %@", name];
    NSArray *filtered = [self.peripheralModels filteredArrayUsingPredicate:predicate];
    
    if (filtered.count > 0) {
        return filtered.firstObject; // Return the first matching object
    }
    return nil; // Return nil if no match is found
}
@end

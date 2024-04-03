#import "VisionController.h"
#import <React/RCTLog.h>
#import <MinttiVisionSDK/MinttiVisionSDK.h>
#import "CBPeripheralModel.h"

@interface VisionController ()
@property (strong, nonatomic) CBCentralManager *centralManager;
@property(nonatomic ,strong) MinttiVisionSDK *visionMTSDK;
@property(nonatomic ,strong) MinttiVisionProtocol *visionMTProtocol;
@end

@implementation VisionController

RCT_EXPORT_MODULE(VisionModule);

- (instancetype)init {
  self = [super init];
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
  RCTLogInfo(@"Starting device scan...");
  [self.visionMTSDK scanStop];
}

#pragma mark - CBCentralManagerDelegate

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
  // Handle updates to the central manager's state
}


- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary<NSString *,id> *)advertisementData RSSI:(NSNumber *)RSSI {
  // Handle discovery of peripherals
  if([peripheral.name hasPrefix:@"Mintti-Vision"])
  {
    [self sendEventWithName:@"onScanResult" body:@{@"name": peripheral.name ?: @"", @"rssi": RSSI, @"mac":peripheral.identifier, @"bluetoothDevice": @{@"address":peripheral.identifier, @"bondState":@"disconnected", @"name":peripheral.name }}];
    NSLog(@"Scan to device %@", peripheral);
  }
}

#pragma mark - CBPeripheralDelegate

// Implement required peripheral delegate methods here...

#pragma mark - VisionProtocolDelegate

// Implement required vision protocol delegate methods here...

@end

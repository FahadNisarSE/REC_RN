#import <React/RCTBridgeModule.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTEventEmitter.h>

// Define the VisionProtocolDelegate if needed
@protocol VisionProtocolDelegate <NSObject>
// Delegate methods definitions...
@end

@interface VisionController : RCTEventEmitter <RCTBridgeModule, CBCentralManagerDelegate, CBPeripheralDelegate, VisionProtocolDelegate>
@end

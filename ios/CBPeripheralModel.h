
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CBPeripheral;

@interface CBPeripheralModel : NSObject

@property(nonatomic, strong) CBPeripheral *peripheral;
@property(nonatomic,copy) NSString *peripheralUUID;
@property(nonatomic,copy) NSString *peripheralName;
@property(nonatomic,strong) NSNumber *peripheralRSSI; //外设信号强度
@end

NS_ASSUME_NONNULL_END

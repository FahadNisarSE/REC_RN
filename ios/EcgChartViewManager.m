// HeartLiveManager.m

#import "React/RCTViewManager.h"
#import "HeartLive.h"
#import <React/RCTUIManager.h>

@interface HeartLiveManager : RCTViewManager
@end

@implementation HeartLiveManager

RCT_EXPORT_MODULE(EcgChartViewManager)

- (UIView *)view
{
  return [[HeartLive alloc] init];
}

// Example of exposing a method to React Native
RCT_EXPORT_METHOD(updateWaveData:(nonnull NSNumber *)reactTag data:(int)data)
{
  [self.bridge.uiManager addUIBlock:
   ^(RCTUIManager *uiManager, NSDictionary<NSNumber *, HeartLive *> *viewRegistry) {
     HeartLive *view = viewRegistry[reactTag];
     if (!view || ![view isKindOfClass:[HeartLive class]]) {
       RCTLogError(@"Cannot find HeartLive with tag #%@", reactTag);
       return;
     }
     [view addEcgData:data];
   }];
}

@end

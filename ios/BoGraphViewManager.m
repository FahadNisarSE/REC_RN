// RCTOxyWaveViewManager.m

#import "React/RCTViewManager.h"
#import "OxyWaveView.h"
#import <React/RCTUIManager.h>

@interface RCTOxyWaveViewManager : RCTViewManager
@end

@implementation RCTOxyWaveViewManager

RCT_EXPORT_MODULE(BoGraphViewManager)

- (UIView *)view
{
  return [[OxyWaveView alloc] init];
}

// Example method to expose updating values
RCT_EXPORT_METHOD(updateWaveData:(nonnull NSNumber *)reactTag next:(NSNumber *)next)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, OxyWaveView *> *viewRegistry) {
    OxyWaveView *view = viewRegistry[reactTag];
    if (!view || ![view isKindOfClass:[OxyWaveView class]]) {
      RCTLogError(@"Cannot find OxyWaveView with tag #%@", reactTag);
      return;
    }
    [view updateValues:next];
  }];
}

// Expose other methods as needed...

@end

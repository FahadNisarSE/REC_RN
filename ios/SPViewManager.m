// RCTSPViewManager.m

#import "React/RCTViewManager.h"
#import "SPView.h"
#import <React/RCTUIManager.h>

@interface RCTSPViewManager : RCTViewManager
@end

@implementation RCTSPViewManager

RCT_EXPORT_MODULE(SPView)

- (UIView *)view
{
  SPView *view = [[SPView alloc] init];
  // Initial configuration if needed
  return view;
}

// Example method to expose SPView's updateValues method to React Native
RCT_EXPORT_METHOD(updateWaveData:(nonnull NSNumber *)reactTag next:(NSNumber *)next)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, SPView *> *viewRegistry) {
    SPView *view = viewRegistry[reactTag];
    if (!view || ![view isKindOfClass:[SPView class]]) {
      RCTLogError(@"Cannot find SPView with tag #%@", reactTag);
      return;
    }
    [view updateValues:next];
  }];
}

@end

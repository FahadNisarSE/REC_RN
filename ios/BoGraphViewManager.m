// RCTOxyWaveViewManager.m

#import "React/RCTViewManager.h"
#import "OxyWaveView.h"
#import <React/RCTUIManager.h>

@interface RCTOxyWaveViewManager : RCTViewManager
@end

static int testData[600] = {0};
static int oxyData[600] = {0};
static int testCount = 0;


@implementation RCTOxyWaveViewManager

RCT_EXPORT_MODULE(BoGraph)

- (UIView *)view
{
  OxyWaveView *oxyWaveView = [[OxyWaveView alloc] init];
  [oxyWaveView setXSpeed:25.0*5.0/14.0 andYheight:3 andYMaxVal:1];
  return oxyWaveView;
}

// Example method to expose updating values
RCT_EXPORT_METHOD(updateWaveData:(NSNumber *)reactTag reactTag:(NSNumber *)reactTag next:(NSNumber *)next)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, OxyWaveView *> *viewRegistry) {
    OxyWaveView *view = viewRegistry[reactTag];
    if (!view || ![view isKindOfClass:[OxyWaveView class]]) {
      RCTLogError(@"Cannot find OxyWaveView with tag #%@", reactTag);
      return;
    }
    
    [view updateValues:@(oxyData[testCount])];
    
    testData[testCount] = next;
    testCount ++;

    if (testCount == 600) {
        testCount = 0;

        int max = 0;
        int min = 353502;

        for (int i = 0; i < 600; i ++) {
            max = testData[i] > max ? testData[i] : max;
            min = testData[i] < min ? testData[i] : min;
//            [_oxyWaveView updateValues:@(testData[i])];
        }
        int dp = (max - min) / 160;
        if (dp == 0) {
            dp = 1.0f;
        }
        
        for (int i = 0; i < 600; i ++) {
            oxyData[i] = 180 -((testData[i] - min)/dp);
        }
    }
    
  }];
}

// Expose other methods as needed...

@end

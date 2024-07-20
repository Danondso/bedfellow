#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import "bedfellow-Swift.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"bedfellow";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
    if (success) {
      //This is where we will put the logic to get access to rootview
      UIView *rootView = self.window.rootViewController.view;
      
      rootView.backgroundColor = [UIColor whiteColor]; // change with your desired backgroundColor
  
      Dynamic *t = [Dynamic new];
      UIView *animationUIView = (UIView *)[t createAnimationViewWithRootView:rootView lottieName:@"loading"]; // change lottieName to your lottie files name
  
      // register LottieSplashScreen to RNSplashScreen
      [RNSplashScreen showLottieSplash:animationUIView inRootView:rootView];
      // casting UIView type to AnimationView type
      LottieAnimationView *animationView = (LottieAnimationView *) animationUIView;
      // play
      [t playWithAnimationView:animationView];
      // If you want the animation layout to be forced to remove when hide is called, use this code
      [RNSplashScreen setAnimationFinished:true];
    }
  
    return success;
}

- (BOOL) application: (UIApplication *)application
             openURL: (NSURL *)url
             options: (NSDictionary<UIApplicationOpenURLOptionsKey, id> *) options
{
  if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
    return YES;
  }
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL) application: (UIApplication *) application
continueUserActivity: (nonnull NSUserActivity *)userActivity
  restorationHandler: (nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  if ([userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
    if (self.authorizationFlowManagerDelegate) {
      BOOL resumableAuth = [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:userActivity.webpageURL];
      if (resumableAuth) {
        return YES;
      }
    }
  }
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}
 
- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

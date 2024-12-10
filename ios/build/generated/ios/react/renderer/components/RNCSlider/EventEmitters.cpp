
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateEventEmitterCpp.js
 */

#include <react/renderer/components/RNCSlider/EventEmitters.h>


namespace facebook::react {

void RNCSliderEventEmitter::onChange(OnChange $event) const {
  dispatchEvent("change", [$event=std::move($event)](jsi::Runtime &runtime) {
    auto $payload = jsi::Object(runtime);
    $payload.setProperty(runtime, "value", $event.value);
$payload.setProperty(runtime, "fromUser", $event.fromUser);
    return $payload;
  });
}


void RNCSliderEventEmitter::onRNCSliderSlidingStart(OnRNCSliderSlidingStart $event) const {
  dispatchEvent("rNCSliderSlidingStart", [$event=std::move($event)](jsi::Runtime &runtime) {
    auto $payload = jsi::Object(runtime);
    $payload.setProperty(runtime, "value", $event.value);
$payload.setProperty(runtime, "fromUser", $event.fromUser);
    return $payload;
  });
}


void RNCSliderEventEmitter::onRNCSliderSlidingComplete(OnRNCSliderSlidingComplete $event) const {
  dispatchEvent("rNCSliderSlidingComplete", [$event=std::move($event)](jsi::Runtime &runtime) {
    auto $payload = jsi::Object(runtime);
    $payload.setProperty(runtime, "value", $event.value);
$payload.setProperty(runtime, "fromUser", $event.fromUser);
    return $payload;
  });
}


void RNCSliderEventEmitter::onRNCSliderValueChange(OnRNCSliderValueChange $event) const {
  dispatchEvent("rNCSliderValueChange", [$event=std::move($event)](jsi::Runtime &runtime) {
    auto $payload = jsi::Object(runtime);
    $payload.setProperty(runtime, "value", $event.value);
$payload.setProperty(runtime, "fromUser", $event.fromUser);
    return $payload;
  });
}

} // namespace facebook::react
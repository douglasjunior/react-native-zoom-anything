// MIT License

// Copyright (c) 2025 Douglas Nassif Roma Junior

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewProps,
} from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  transformLayer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export type ZoomProps = {
  readonly children?: React.ReactElement<{ onLayout: ViewProps['onLayout'] }>;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly style?: ViewProps['style'];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const EPS = 1e-3;
const ANIM_DURATION_MS = 200;
const INERTIA_PROJECTION_MS = 300;

const Zoom = ({ children, minZoom = 1, maxZoom = 5, style }: ZoomProps) => {
  const scale = useRef(new Animated.Value(minZoom)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastParallel = useRef<Animated.CompositeAnimation | null>(null);

  const committedScale = useRef(minZoom);
  const committedTranslateX = useRef(0);
  const committedTranslateY = useRef(0);

  const containerWidthPx = useRef(0);
  const containerHeightPx = useRef(0);
  const contentWidthPx = useRef(0);
  const contentHeightPx = useRef(0);

  const panStartTranslateX = useRef(0);
  const panStartTranslateY = useRef(0);

  const computePanBounds = (scaleValue: number) => {
    const containerWidth = containerWidthPx.current;
    const containerHeight = containerHeightPx.current;
    const contentWidthScaled = contentWidthPx.current * scaleValue;
    const contentHeightScaled = contentHeightPx.current * scaleValue;

    const maxPanX = Math.max(0, (contentWidthScaled - containerWidth) / 2);
    const maxPanY = Math.max(0, (contentHeightScaled - containerHeight) / 2);
    return {
      minX: -maxPanX,
      maxX: maxPanX,
      minY: -maxPanY,
      maxY: maxPanY,
    } as const;
  };

  const stopAnimations = () => {
    lastParallel.current?.stop();
    lastParallel.current = null;
  };

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      containerWidthPx.current = width;
      containerHeightPx.current = height;

      const { minX, maxX, minY, maxY } = computePanBounds(
        committedScale.current,
      );
      const clampedX = clamp(committedTranslateX.current, minX, maxX);
      const clampedY = clamp(committedTranslateY.current, minY, maxY);
      committedTranslateX.current = clampedX;
      committedTranslateY.current = clampedY;
      translateX.setValue(clampedX);
      translateY.setValue(clampedY);
    },
    [translateX, translateY],
  );

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      contentWidthPx.current = width;
      contentHeightPx.current = height;
      const { minX, maxX, minY, maxY } = computePanBounds(
        committedScale.current,
      );
      const clampedX = clamp(committedTranslateX.current, minX, maxX);
      const clampedY = clamp(committedTranslateY.current, minY, maxY);
      committedTranslateX.current = clampedX;
      committedTranslateY.current = clampedY;
      translateX.setValue(clampedX);
      translateY.setValue(clampedY);
    },
    [translateX, translateY],
  );

  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onStart(event => {
      if (event.numberOfPointers !== 2) return;
      stopAnimations();
    })
    .onUpdate(event => {
      if (event.numberOfPointers !== 2) return;
      const clampedScale = clamp(
        committedScale.current * event.scale,
        minZoom,
        maxZoom,
      );
      scale.setValue(clampedScale);
      const { minX, maxX, minY, maxY } = computePanBounds(clampedScale);
      const clampedX = clamp(committedTranslateX.current, minX, maxX);
      const clampedY = clamp(committedTranslateY.current, minY, maxY);
      translateX.setValue(clampedX);
      translateY.setValue(clampedY);
    })
    .onEnd(e => {
      const clampedScale = clamp(
        committedScale.current * e.scale,
        minZoom,
        maxZoom,
      );
      committedScale.current = clampedScale;
      scale.setValue(clampedScale);
      const { minX, maxX, minY, maxY } = computePanBounds(clampedScale);
      const clampedX = clamp(committedTranslateX.current, minX, maxX);
      const clampedY = clamp(committedTranslateY.current, minY, maxY);
      committedTranslateX.current = clampedX;
      committedTranslateY.current = clampedY;
      translateX.setValue(clampedX);
      translateY.setValue(clampedY);
    });

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      panStartTranslateX.current = committedTranslateX.current;
      panStartTranslateY.current = committedTranslateY.current;
    })
    .onUpdate(event => {
      if (committedScale.current <= minZoom + EPS) return;
      const currentScale = committedScale.current;
      const { minX, maxX, minY, maxY } = computePanBounds(currentScale);
      const clampedX = clamp(
        panStartTranslateX.current + event.translationX,
        minX,
        maxX,
      );
      const clampedY = clamp(
        panStartTranslateY.current + event.translationY,
        minY,
        maxY,
      );
      translateX.setValue(clampedX);
      translateY.setValue(clampedY);
    })
    .onEnd(event => {
      if (committedScale.current <= minZoom + EPS) {
        committedTranslateX.current = 0;
        committedTranslateY.current = 0;
        translateX.setValue(0);
        translateY.setValue(0);
        return;
      }
      const currentScale = committedScale.current;
      const { minX, maxX, minY, maxY } = computePanBounds(currentScale);
      const releaseX = clamp(
        panStartTranslateX.current + event.translationX,
        minX,
        maxX,
      );
      const releaseY = clamp(
        panStartTranslateY.current + event.translationY,
        minY,
        maxY,
      );

      const dt = INERTIA_PROJECTION_MS / 1000;
      const projectedX = releaseX + (event.velocityX ?? 0) * dt;
      const projectedY = releaseY + (event.velocityY ?? 0) * dt;
      const targetX = clamp(projectedX, minX, maxX);
      const targetY = clamp(projectedY, minY, maxY);

      committedTranslateX.current = targetX;
      committedTranslateY.current = targetY;

      lastParallel.current = Animated.parallel(
        [
          Animated.timing(translateX, {
            toValue: targetX,
            duration: INERTIA_PROJECTION_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: targetY,
            duration: INERTIA_PROJECTION_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ],
        { stopTogether: true },
      );
      lastParallel.current.start();
    });

  function getTargetScale() {
    const midScale = (minZoom + maxZoom) / 2;
    if (Math.abs(committedScale.current - minZoom) < EPS) return midScale;
    else if (committedScale.current < maxZoom - EPS) return maxZoom;
    return minZoom;
  }

  const doubleTapGesture = Gesture.Tap()
    .runOnJS(true)
    .numberOfTaps(2)
    .onEnd((event, success) => {
      if (!success) return;
      stopAnimations();

      let targetScale = getTargetScale();

      const containerW = containerWidthPx.current;
      const containerH = containerHeightPx.current;
      const tapXFromCenter = (event.x ?? containerW / 2) - containerW / 2;
      const tapYFromCenter = (event.y ?? containerH / 2) - containerH / 2;

      const currentScale = committedScale.current;
      const ratio = targetScale / currentScale;
      const targetTx =
        tapXFromCenter - ratio * (tapXFromCenter - committedTranslateX.current);
      const targetTy =
        tapYFromCenter - ratio * (tapYFromCenter - committedTranslateY.current);

      const { minX, maxX, minY, maxY } = computePanBounds(targetScale);
      const clampedTx = clamp(targetTx, minX, maxX);
      const clampedTy = clamp(targetTy, minY, maxY);

      committedScale.current = targetScale;
      committedTranslateX.current = clampedTx;
      committedTranslateY.current = clampedTy;

      lastParallel.current = Animated.parallel(
        [
          Animated.timing(scale, {
            toValue: targetScale,
            duration: ANIM_DURATION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: clampedTx,
            duration: ANIM_DURATION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: clampedTy,
            duration: ANIM_DURATION_MS,
            useNativeDriver: true,
          }),
        ],
        { stopTogether: true },
      );
      lastParallel.current.start();
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture,
  );

  const contentStyle = useMemo(
    () => [
      styles.transformLayer,
      {
        transform: [{ translateX }, { translateY }, { scale }],
      },
    ],
    [translateX, translateY, scale],
  );

  const containerStyles = useMemo(() => [styles.container, style], [style]);

  return (
    <GestureDetector gesture={composedGesture}>
      <View onLayout={onContainerLayout} style={containerStyles}>
        <Animated.View style={contentStyle}>
          {children
            ? React.cloneElement(children, {
                onLayout: onContentLayout,
              })
            : null}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default Zoom;

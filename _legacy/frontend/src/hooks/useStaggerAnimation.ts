import { useMemo } from 'react';
import { STAGGER_ANIMATION } from '@/constants/styles';

export interface UseStaggerAnimationProps {
  index: number;
  customDelay?: number;
  customMax?: number;
}

export const useStaggerAnimation = ({
  index,
  customDelay = STAGGER_ANIMATION.delay.base,
  customMax = STAGGER_ANIMATION.delay.max,
}: UseStaggerAnimationProps) => {
  const animationDelay = useMemo(() => {
    return Math.min(index * customDelay, customMax);
  }, [index, customDelay, customMax]);

  return {
    style: {
      animationDelay: `${animationDelay}ms`,
    },
    delay: animationDelay,
  };
};

export const useStaggerAnimationStyle = (index: number) => {
  const { style } = useStaggerAnimation({ index });
  return style;
};
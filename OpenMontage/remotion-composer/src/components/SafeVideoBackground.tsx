import React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";

class VideoErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export interface SafeVideoBackgroundProps {
  src: string;
  style?: React.CSSProperties;
  fallbackBackground?: string;
}

export const SafeVideoBackground: React.FC<SafeVideoBackgroundProps> = ({
  src,
  style,
  fallbackBackground = "#0F172A",
}) => {
  if (!src) {
    return <AbsoluteFill style={{ background: fallbackBackground, ...style }} />;
  }

  const fallback = (
    <AbsoluteFill style={{ background: fallbackBackground, ...style }} />
  );

  return (
    <VideoErrorBoundary fallback={fallback}>
      <OffthreadVideo
        src={src}
        style={style}
        onError={() => {}}
      />
    </VideoErrorBoundary>
  );
};

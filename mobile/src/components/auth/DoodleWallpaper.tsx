/**
 * DoodleWallpaper
 *
 * Scattered college-themed line-art icons across the screen.
 * Inspired by Telegram's wallpaper personality — subtle, low-contrast,
 * white stroke on dark background at ~8% opacity.
 *
 * Each icon is drawn in SVG with strokeWidth 1.5, no fill, rounded caps.
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

const COLOR = 'rgba(255,255,255,0.72)'; // will be dimmed by parent opacity

// ─── Individual doodle icons ──────────────────────────────────────────────────

function CoffeeCup() {
  return (
    <Svg width={38} height={44} viewBox="0 0 38 44" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M11 8 Q10 4 12 0" />
        <Path d="M19 6 Q18 3 20 0" />
        <Path d="M27 8 Q28 4 26 0" />
        <Path d="M4 44 L4 13 Q4 9 8 9 L30 9 Q34 9 34 13 L34 44 Z" />
        <Path d="M34 20 Q42 20 42 28 Q42 36 34 36" />
        <Path d="M9 23 L29 23" />
      </G>
    </Svg>
  );
}

function SoloCup() {
  return (
    <Svg width={30} height={36} viewBox="0 0 30 36" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 2 L9 34 L21 34 L27 2 Z" />
        <Path d="M3 2 L27 2" />
        <Path d="M5 14 L25 14" />
        <Path d="M6 22 L24 22" />
        <Path d="M8 30 L22 30" />
      </G>
    </Svg>
  );
}

function PizzaSlice() {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M18 2 L2 34 L34 34 Z" />
        <Path d="M2 34 Q18 40 34 34" />
        <Path d="M3 31 Q18 37 33 31" />
        <Circle cx="13" cy="22" r="2.5" />
        <Circle cx="23" cy="22" r="2.5" />
        <Circle cx="18" cy="15" r="2.5" />
      </G>
    </Svg>
  );
}

function Laptop() {
  return (
    <Svg width={44} height={32} viewBox="0 0 44 32" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Rect x="5" y="2" width="34" height="22" rx="2" />
        <Path d="M0 30 L44 30 L44 28 Q44 26 42 26 L2 26 Q0 26 0 28 Z" />
        <Path d="M9 8 L35 8" />
        <Path d="M9 12 L35 12" />
        <Path d="M9 16 L28 16" />
      </G>
    </Svg>
  );
}

function OpenBook() {
  return (
    <Svg width={40} height={32} viewBox="0 0 40 32" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 4 Q14 2 4 4 L4 30 Q14 28 20 30 Q26 28 36 30 L36 4 Q26 2 20 4 Z" />
        <Path d="M20 4 L20 30" />
        <Path d="M8 10 L18 9" />
        <Path d="M8 14 L18 13" />
        <Path d="M8 18 L18 17" />
        <Path d="M22 10 L32 9" />
        <Path d="M22 14 L32 13" />
        <Path d="M22 18 L32 17" />
      </G>
    </Svg>
  );
}

function Backpack() {
  return (
    <Svg width={32} height={40} viewBox="0 0 32 40" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M6 38 L6 14 Q6 8 16 8 Q26 8 26 14 L26 38 Q26 40 16 40 Q6 40 6 38 Z" />
        <Path d="M11 8 L11 4 Q11 2 16 2 Q21 2 21 4 L21 8" />
        <Rect x="9" y="22" width="14" height="11" rx="1" />
        <Path d="M9 22 L23 22" />
        <Circle cx="16" cy="28" r="1.5" />
      </G>
    </Svg>
  );
}

function Earbuds() {
  return (
    <Svg width={36} height={34} viewBox="0 0 36 34" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="8" cy="12" r="7" />
        <Circle cx="8" cy="12" r="3" />
        <Circle cx="28" cy="12" r="7" />
        <Circle cx="28" cy="12" r="3" />
        <Path d="M8 19 Q8 28 18 28 Q28 28 28 19" />
        <Path d="M18 28 L18 34" />
        <Circle cx="18" cy="34" r="1.5" />
      </G>
    </Svg>
  );
}

function EnergyDrink() {
  return (
    <Svg width={22} height={42} viewBox="0 0 22 42" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 36 L3 10 Q3 6 11 6 Q19 6 19 10 L19 36 Q19 40 11 40 Q3 40 3 36 Z" />
        <Path d="M4 10 Q11 8 18 10" />
        <Path d="M9 6 L13 6 L13 3 L9 3 Z" />
        <Path d="M3 18 L0 14 L2 20 Z" fill={COLOR} />
        <Path d="M19 18 L22 14 L20 20 Z" fill={COLOR} />
        <Path d="M6 22 L16 22" />
        <Path d="M5 26 L17 26" />
      </G>
    </Svg>
  );
}

function RamenBowl() {
  return (
    <Svg width={38} height={30} viewBox="0 0 38 30" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 12 Q4 28 19 28 Q34 28 34 12 Z" />
        <Path d="M2 12 L36 12" />
        <Path d="M6 4 L17 16" />
        <Path d="M11 2 L22 14" />
        <Path d="M6 18 Q12 15 19 18 Q26 21 32 18" />
        <Path d="M5 22 Q12 19 19 22 Q26 25 33 22" />
      </G>
    </Svg>
  );
}

function Notebook() {
  return (
    <Svg width={30} height={38} viewBox="0 0 30 38" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Rect x="6" y="2" width="22" height="34" rx="1" />
        <Path d="M6 8 L2 8" />
        <Path d="M6 14 L2 14" />
        <Path d="M6 20 L2 20" />
        <Path d="M6 26 L2 26" />
        <Path d="M6 32 L2 32" />
        <Path d="M10 10 L24 10" />
        <Path d="M10 15 L24 15" />
        <Path d="M10 20 L24 20" />
        <Path d="M10 25 L24 25" />
        <Path d="M10 30 L20 30" />
        <Path d="M10 2 L10 36" strokeDasharray="0" />
      </G>
    </Svg>
  );
}

function StudentID() {
  return (
    <Svg width={40} height={28} viewBox="0 0 40 28" fill="none">
      <G stroke={COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <Rect x="2" y="2" width="36" height="24" rx="3" />
        <Rect x="6" y="6" width="12" height="14" rx="1" />
        <Path d="M2 2 L38 2 L38 8 L2 8 Z" />
        <Path d="M22 11 L34 11" />
        <Path d="M22 15 L34 15" />
        <Path d="M22 19 L30 19" />
      </G>
    </Svg>
  );
}

// ─── Layout — scattered grid ──────────────────────────────────────────────────
//
// Fixed positions across the screen so the layout is always intentional.
// Extra items extend slightly off-screen for a seamless tile feel.

type DoodleItem = {
  component: React.ReactNode;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
};

const ITEMS: DoodleItem[] = [
  { component: <CoffeeCup />,   x: 18,   y: 55,  rotation: -18, opacity: 0.09 },
  { component: <PizzaSlice />,  x: 118,  y: 20,  rotation: 22,  opacity: 0.07 },
  { component: <SoloCup />,     x: 248,  y: 64,  rotation: 8,   opacity: 0.08 },
  { component: <Laptop />,      x: 326,  y: 28,  rotation: -12, opacity: 0.07 },
  { component: <StudentID />,   x: -14,  y: 170, rotation: 15,  opacity: 0.08 },
  { component: <OpenBook />,    x: 155,  y: 148, rotation: -24, opacity: 0.09 },
  { component: <Earbuds />,     x: 306,  y: 155, rotation: 20,  opacity: 0.07 },
  { component: <EnergyDrink />, x: 66,   y: 282, rotation: -6,  opacity: 0.08 },
  { component: <RamenBowl />,   x: 192,  y: 265, rotation: 14,  opacity: 0.09 },
  { component: <Notebook />,    x: 338,  y: 290, rotation: -30, opacity: 0.07 },
  { component: <CoffeeCup />,   x: -18,  y: 390, rotation: 28,  opacity: 0.08 },
  { component: <Backpack />,    x: 130,  y: 375, rotation: -10, opacity: 0.09 },
  { component: <PizzaSlice />,  x: 280,  y: 400, rotation: 18,  opacity: 0.07 },
  { component: <SoloCup />,     x: 370,  y: 370, rotation: -22, opacity: 0.08 },
  { component: <Laptop />,      x: 30,   y: 500, rotation: 12,  opacity: 0.07 },
  { component: <Earbuds />,     x: 190,  y: 488, rotation: -16, opacity: 0.09 },
  { component: <StudentID />,   x: 340,  y: 510, rotation: 25,  opacity: 0.08 },
  { component: <RamenBowl />,   x: -10,  y: 610, rotation: -8,  opacity: 0.08 },
  { component: <EnergyDrink />, x: 148,  y: 592, rotation: 30,  opacity: 0.07 },
  { component: <OpenBook />,    x: 290,  y: 615, rotation: -14, opacity: 0.09 },
  { component: <CoffeeCup />,   x: 60,   y: 720, rotation: 6,   opacity: 0.08 },
  { component: <Notebook />,    x: 210,  y: 708, rotation: -20, opacity: 0.07 },
  { component: <Backpack />,    x: 350,  y: 730, rotation: 16,  opacity: 0.08 },
  { component: <PizzaSlice />,  x: -8,   y: 820, rotation: -25, opacity: 0.07 },
  { component: <SoloCup />,     x: 158,  y: 810, rotation: 10,  opacity: 0.08 },
  { component: <Laptop />,      x: 310,  y: 840, rotation: -5,  opacity: 0.07 },
];

export default function DoodleWallpaper() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {ITEMS.map((item, i) => (
        <View
          key={i}
          style={[
            styles.item,
            {
              left: item.x,
              top: item.y,
              opacity: item.opacity,
              transform: [{ rotate: `${item.rotation}deg` }],
            },
          ]}
        >
          {item.component}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
  },
});

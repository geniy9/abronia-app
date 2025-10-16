<template>
  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute bg-primary w-80 h-80 -top-24 -left-24 circle-1"></div>
    <div class="absolute bg-primary w-90 h-90 -bottom-36 -right-36 circle-2"></div>
    <div class="backdrop absolute inset-0 backdrop-blur-3xl bg-black/40"></div>
  </div>
</template>
<style setup>
.circle-1 {
  animation:
    moveCircle1 12s infinite alternate ease-in-out,
    shapeCircle1 4s infinite alternate ease-in-out;
}
.circle-2 {
  animation:
    moveCircle2 18s infinite alternate ease-in-out,
    shapeCircle2 2s infinite alternate ease-in-out;
}
@keyframes moveCircle1 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  25% { transform: translate(80px, 10px); opacity: 0.5; }
  50% { transform: translate(-30px, 50px) scale(1.3); opacity: 1; }
  75% { transform: translate(70px, -30px); opacity: 0.7; }
  100% { transform: translate(0, 0) scale(1); opacity: 1; }
}
@keyframes shapeCircle1 {
  0% { border-radius: 50%; }
  50% { border-radius: 60% 30% 70% 20% / 40% 70% 30% 60%; }
  100% { border-radius: 50%; }
}
@keyframes moveCircle2 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  25% { transform: translate(-120px, -40px); opacity: 0.7; }
  50% { transform: translate(30px, -140px) scale(1.3); opacity: 1; }
  75% { transform: translate(10px, 20px); opacity: 0.5; }
  100% { transform: translate(0, 0) scale(1); opacity: 1; }
}
@keyframes shapeCircle2 {
  0% { border-radius: 50%; }
  50% { border-radius: 30% 70% 40% 60% / 70% 20% 60% 40%; }
  100% { border-radius: 50%; }
}
</style>
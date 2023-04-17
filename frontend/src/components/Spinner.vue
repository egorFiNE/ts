<template>
  <div class="atom">
    <div class="nucleus" />
    <div class="orbit">
      <div class="electron" />
    </div>
    <div class="orbit">
      <div class="electron" />
    </div>
    <div class="orbit">
      <div class="electron" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

@mixin keyframes($animation-name) {
    @-webkit-keyframes #{$animation-name} {
        @content;
    }
    @-moz-keyframes #{$animation-name} {
        @content;
    }
    @-ms-keyframes #{$animation-name} {
        @content;
    }
    @-o-keyframes #{$animation-name} {
        @content;
    }
    @keyframes #{$animation-name} {
        @content;
    }
}

@mixin animation($str) {
  -webkit-animation: #{$str};
  -moz-animation: #{$str};
  -ms-animation: #{$str};
  -o-animation: #{$str};
  animation: #{$str};
}

$atomSize : 30px;
$nucleusSize : 5px;
$orbitSize : 25px;
$electronSize : 3px;

$protonColor: #999999;
$electronColor: #555555;
$orbitColor: rgba(0, 0, 0, 0.6);

body{
  text-align: center;
  background:rgba(0,0,0,1);
}
.atom{
  position:relative;
  width: $atomSize;
  height: $atomSize;
  display:inline-block;
  vertical-align: middle;
}

.nucleus, .orbit, .electron, .orbitTrain, .electronTrain{
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  width:$nucleusSize;
  height:$nucleusSize;
  border-radius:50%;
  margin: auto;
}

.nucleus{
  background:$protonColor;
  box-shadow: 0 0 15px $protonColor;
  @include animation('shining 2s infinite linear');
}

.orbit:before {
  content: " ";
  position: absolute;
  z-index: -1;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius:50%;
}

.orbit{
  width:$orbitSize;
  height:$orbitSize;
  border:1px solid $orbitColor;
  transform-style: preserve-3d;
  @include animation('orbitSpecial 1.5s infinite linear');
  .electron{
    position:relative;
    top: math.div(($orbitSize - $electronSize), 2);
    width:$electronSize;
    height:$electronSize;
    background:$electronColor;
    box-shadow: 0 0 15px $electronColor;
    border-radius:50%;
    transform: translateX(math.div($orbitSize, 2));
    @include animation('electronAnimation 1.5s infinite linear');
  }
}

.orbit:nth-child(4){
  transform:rotateY(65deg) rotateX(5deg);
    animation-delay: -1s;
  .electron{
    animation-delay: -1s;
  }
}

.orbit:nth-child(2){
  transform:rotateY(65deg) rotateX(-54deg);
  animation-delay: -1s;
  animation-duration: 1s;
  .electron{
    animation-duration: 1s;
  }
}

.orbit:nth-child(3){
  transform:rotateY(65deg) rotateX(54deg);
}

@include keyframes(electronAnimation) {
  0% { transform: rotateZ(0deg)  translateX(math.div($orbitSize, 2)) rotateZ(-0deg) rotateY(-65deg)}
  100% { transform: rotateZ(360deg) translateX(math.div($orbitSize, 2)) rotateZ(-360deg) rotateY(-65deg)}
}

@include keyframes(orbitSpecial) {
  0% { border-top: 0px solid $orbitColor }
  35% { border-right: 0px solid $orbitColor }
  70% { border-bottom: 0px solid $orbitColor }
  100% { border-left: 0px solid $orbitColor }
}

@include keyframes(shining) {
  0% {
    box-shadow: 0 0 0 transparent;
  } 50% {
    box-shadow: 0 0 40px $protonColor;
  } 100% {
    box-shadow: 0 0 0 transparent;
  }
}
</style>

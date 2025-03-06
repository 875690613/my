<template>
	<div
		:style="{
			color: '#fff',
			borderRadius: '50%',
			width: size + 'px',
			height: size + 'px',
			display: 'block',
			textAlign: 'center',
			lineHeight: size + 'px',
			fontSize: size * 0.4 + 'px',
			background: color(name)
		}"
	>
		{{ name.slice(-cutNum) }}
	</div>
</template>
 
<script lang="ts" setup>
defineProps({
	name: {
		type: String,
		default: ""
	},
	size: {
		type: Number,
		default: 16
	},
	cutNum: {
		type: Number,
		default: 1
	}
});
 
const color = (name: string) => {
	let num1 = Math.floor(Math.random() * 99 + 100).toString();
	let num2 = Math.floor(Math.random() * 900 + 100).toString();
	let num3 = Math.floor(Math.random() * 200 + 100).toString();
	if (name) {
    // console.log("name:",name,name.length);
		let num = "";
    if (name.length == 1) {
      //随机生成三位数字
      // return `#${num2}fa`;
    //   return `rgb(${num1},${num3},${num2})`;
    } else {
      for (let i = 0; i < name.length; i++) {
        num += name[i].charCodeAt(0).toString();
      }
      const r = Math.min(100 + (parseInt(num.slice(0, 2), 10) % 55), 255);
      const g = Math.min(100 + (parseInt(num.slice(2, 4), 10) % 55), 255);
      const b = Math.min(100 + (parseInt(num.slice(4, 6), 10) % 55), 255);
    //   return `rgb(${r}, ${g}, ${b})`;
	return `rgb(${num1},${num3},${num2})`;
    }
	} else {
		return `rgb(${num1},${num3},${num2})`;
	}
};
</script>
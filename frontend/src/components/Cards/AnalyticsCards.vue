<template>
    <div class="card" ref="card">
      <div class="card-icon" :style="{ backgroundColor: color.bg }">
        <i :class="card.icon" :style="{ color: color.text }">i</i>
      </div>
      <div class="card-value">{{ cardValue }}</div>
      <div class="card-title">{{ card.title }}</div>
      <!-- <div class="card-status" :style="{ color: status > 0 ? '#35AF8E' : '#FF2332' }">
        <span>
          <i :class="status > 0 ? 'fas fa-angle-up' : 'fas fa-angle-down'"></i>
        </span>
        {{ calculateStatus(card.newVal, card.pastVal) + '%' }}
      </div> -->
    </div>
  </template>
  
  <script>
  import { gsap, Sine } from 'gsap';
  export default {
    name: 'AnalyticsCard',
    props: ['card', 'color', 'index'],
    data() {
      return {
        status: 0,
        loading: true,
        hover: true,
      };
    },
    computed: {
      cardValue() {
        let unit = this.card.unit;
        let val = this.card.newVal;
        if (unit === 'k') {
          val = val / 1000;
        }
        return val + unit;
      },
    },
    methods: {
      calculateStatus(newVal, pastVal) {
        this.status = (newVal - pastVal) / 100;
        return this.status;
      },
      toggle() {
        console.log('active');
        this.hover = !this.hover;
      },
    },
    mounted() {
      let delay = this.index * 0.25;
      const tl = new gsap.timeline();
      tl.from(this.$refs.card, 1, {
        y: 60,
        opacity: 0,
        ease: Sine.out,
        delay,
      }).to(this.$refs.card, 1, {
        y: 0,
        opacity: 1,
        ease: Sine.out,
      });
    },
  };
  </script>
  <style>
.card {
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 20px 40px 0 rgba(204, 204, 204, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
}
.card-value {
  font-size: 30px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: #2d2f38;
  padding: 20px;
}
.card-title {
  color: #949ea1;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 10px;
}
.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-status {
  font-weight: 500;
  font-size: 14px;
}
</style>
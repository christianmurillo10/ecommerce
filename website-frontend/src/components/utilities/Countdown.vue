<template>
  <div id="countdown">
    <div>
      <span class="days">{{ this.days }}</span>
      <div class="smalltext">Days</div>
    </div>
    <div>
      <span class="hours">{{ this.hours }}</span>
      <div class="smalltext">Hours</div>
    </div>
    <div>
      <span class="minutes">{{ this.minutes }}</span>
      <div class="smalltext">Minutes</div>
    </div>
    <div>
      <span class="seconds">{{ this.seconds }}</span>
      <div class="smalltext">Seconds</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    endTime: String,
  },

  data: () => ({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  }),

  created() {
    this.setTimeRemaining(this.endTime);
  },

  methods: {
    setTimeRemaining(endTime) {
      setInterval(() => {
        const { days, hours, minutes, seconds } = this.getTimeRemaining(
          endTime
        );
        this.days = days;
        this.hours = ("0" + hours).slice(-2);
        this.minutes = ("0" + minutes).slice(-2);
        this.seconds = ("0" + seconds).slice(-2);
      }, 1000);
    },

    getTimeRemaining(endTime) {
      const total = Date.parse(endTime) - Date.parse(new Date());
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      return {
        total,
        days,
        hours,
        minutes,
        seconds,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
#countdown {
  color: #fff;
  display: inline-block;
  text-align: center;
}

#countdown > div {
  margin: 1px;
  padding: 2px;
  border-radius: 3px;
  background: #2196f3;
  display: inline-block;
}

#countdown div > span {
  padding: 5px 10px 5px 10px;
  border-radius: 3px;
  background: #90caf9;
  display: block;
}

.smalltext {
  font-size: 10px;
}
</style>

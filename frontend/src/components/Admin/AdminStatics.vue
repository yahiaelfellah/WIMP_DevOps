<template>
  <div class="analytics-dashboard">
    <analytics-card
      v-for="(card, index) in cards"
      :key="index"
      :card="card"
      :color="colors[index % colors.length]"
      :index="index"
    ></analytics-card>
  </div>
</template>
  
  <script>
import AnalyticsCard from "../Cards/AnalyticsCards.vue"; // Adjust the path as needed
import { userService } from "../../services/user.service";
import { flowService } from "../../services/flow.service";

export default {
  name: "AnalyticsDashboard",
  components: {
    AnalyticsCard,
  },
  data() {
    return {
      colors: [
        {
          bg: "#E5F3FE",
          text: "#0383FF",
        },
        {
          bg: "#F3F1FF",
          text: "#876CFF",
        },
        {
          bg: "#FFF8E5",
          text: "#FEB801",
        },
        {
          bg: "#EBF9E9",
          text: "#42C73E",
        },
      ],
      cards: [
        {
          newVal: 0,
          pastVal: 0,
          unit: "",
          title: "Total Number of users",
          icon: "el-icon-delete",
        },
        {
          newVal: 0,
          pastVal: 0,
          unit: "",
          title: "Total of Running flows",
          icon: "fas fa-pen",
        },
      ],
    };
  },
  methods: {
    simulateDataPooling() {
      setInterval(() => {
        // Simulate fetching new data from the backend
        const newData = [
          {
            newVal: Math.floor(Math.random() * 1000),
            pastVal: Math.floor(Math.random() * 800),
            unit: "k",
            title: "Total lines of code",
            icon: "fas fa-grip-lines",
          },
          {
            newVal: Math.floor(Math.random() * 500),
            pastVal: Math.floor(Math.random() * 300),
            unit: "",
            title: "Total commits",
            icon: "fas fa-pen",
          },
          {
            newVal: Math.floor(Math.random() * 20),
            pastVal: Math.floor(Math.random() * 20),
            unit: "%",
            title: "Total contributions",
            icon: "fas fa-external-link-alt",
          },
        ];

        // Update the cards data with the new data
        this.cards.forEach((card, index) => {
          card.newVal = newData[index].newVal;
          card.pastVal = newData[index].pastVal;
        });
      }, 5000); // Fetch data every 5 seconds (adjust as needed)
    },
    updateDataFromBackend() {
      // Simulate fetching new data from the backend
      // Update this.cards with the new data
      // This will automatically trigger a re-render of the view
      setInterval(async () => {
        const userData = await userService.getAll();
        const flowData = await flowService.getAll();
        const newData = [
          {
            newVal: userData.data.length,
            pastVal: userData.data.length - 1,
          },
          {
            newVal: flowData.data.filter((o) => o.isRunning).length,
            pastVal: flowData.data.length,
          }
        ];

        // Update the cards data with the new data
        this.cards.forEach((card, index) => {
          card.newVal = newData[index].newVal;
          card.pastVal = newData[index].pastVal;
        });
      }, 5000);
    },
  },
  created() {
    // Start simulating data pooling when the component is created
    //this.simulateDataPooling();
    this.updateDataFromBackend();
  },
};
</script>
  
  <style scoped>
.analytics-dashboard {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
</style>
  
<script setup lang="ts">
import {ref, watch, onMounted} from "vue";
import {SkeletonText} from "skeleton-elements/vue";
import "./assets/main.css";

const profileName = ref("Jeremy Robson");

interface DataObjects {
    title: string;
    icon: string;
    themeColor: string;
    timeframes: {
        [key: string]: {
            current: number;
            previous: number;
        };
    };
}

const data = ref<DataObjects[]>([]);
const dataLoaded = ref(false);
const loading = ref(true);

const timeframePeriods = ref(["daily", "weekly", "monthly"]);
const selectedTimeframe = ref("weekly");

const loadTimeTrackingData = async () => {
    // GET The time tracking data
    await fetch("./data/data.json")
        .then((response) => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((dataValue) => {
            data.value = dataValue;
            dataLoaded.value = true;
            loading.value = true;
            console.log(data.value);
        })
        .catch((error) => {
            console.error("Error getting data: " + error);
        });
};

const openDetail = (item: any) => {
    console.log(item);
};

watch(
    selectedTimeframe,
    () => {
        loading.value = true;
        setTimeout(() => {
            loading.value = false;
        }, 1200);
    },
    {immediate: true}
);

onMounted(() => {
    // Load the Data
    loadTimeTrackingData();
});
</script>

<template>
    <div class="time-tracking-dashboard">
        <aside class="profile-and-control-panel">
            <header class="profile">
                <div class="profile__image">
                    <img src="./assets/img/image-jeremy.png" alt="Jeremy Robson" />
                </div>
                <div class="profile__info">
                    <div class="eyebrow">Report for</div>
                    <div class="profile__name">
                        <h2>{{ profileName }}</h2>
                    </div>
                </div>
            </header>
            <div :class="`time-period-toggle ${dataLoaded ? `loaded` : ``}`">
                <ul>
                    <li v-for="(timeframe, index) in timeframePeriods" :key="`timeframe_${index}`">
                        <a @click="selectedTimeframe = timeframe" :class="`button clear ${selectedTimeframe === timeframe ? `active` : ``}`">{{
                            timeframe
                        }}</a>
                    </li>
                </ul>
            </div>
        </aside>

        <section class="time-tracking-dashboard__cards">
            <div :class="`card ${loading ? `loading` : ``}`" v-for="(item, index) in data" :key="`item_${index}`">
                <div class="card__background" :style="`background-color: ${item.themeColor}`">
                    <img :src="`./assets/img/${item.icon}`" alt="Work" />
                    <div class="card-peek-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                            <path
                                d="M64 64V241.6c5.2-1 10.5-1.6 16-1.6H96V208 64c0-8.8-7.2-16-16-16s-16 7.2-16 16zM80 288c-17.7 0-32 14.3-32 32c0 0 0 0 0 0v24c0 66.3 53.7 120 120 120h48c52.5 0 97.1-33.7 113.4-80.7c-3.1 .5-6.2 .7-9.4 .7c-20 0-37.9-9.2-49.7-23.6c-9 4.9-19.4 7.6-30.3 7.6c-15.1 0-29-5.3-40-14c-11 8.8-24.9 14-40 14H120c-13.3 0-24-10.7-24-24s10.7-24 24-24h40c8.8 0 16-7.2 16-16s-7.2-16-16-16H120 80zM0 320s0 0 0 0c0-18 6-34.6 16-48V64C16 28.7 44.7 0 80 0s64 28.7 64 64v82c5.1-1.3 10.5-2 16-2c25.3 0 47.2 14.7 57.6 36c7-2.6 14.5-4 22.4-4c20 0 37.9 9.2 49.7 23.6c9-4.9 19.4-7.6 30.3-7.6c35.3 0 64 28.7 64 64v64 24c0 92.8-75.2 168-168 168H168C75.2 512 0 436.8 0 344V320zm336-64c0-8.8-7.2-16-16-16s-16 7.2-16 16v48 16c0 8.8 7.2 16 16 16s16-7.2 16-16V256zM160 240c5.5 0 10.9 .7 16 2v-2V208c0-8.8-7.2-16-16-16s-16 7.2-16 16v32h16zm64 24v40c0 8.8 7.2 16 16 16s16-7.2 16-16V256 240c0-8.8-7.2-16-16-16s-16 7.2-16 16v24z"
                            />
                        </svg>
                    </div>
                </div>
                <div class="card__content">
                    <header class="card__content__header">
                        <div class="card__content__header__title">{{ item.title }}</div>
                        <a @click="openDetail(item.title)" class="card__content__header__more">
                            <svg width="25" height="5" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm10 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm10 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                                    fill="#BBC0FF"
                                    fill-rule="evenodd"
                                />
                            </svg>
                            <br />
                        </a>
                    </header>
                    <div class="card__content__body">
                        <div class="card__current-data">
                            <span :class="`card__current-data-value ${loading ? `skeleton skeleton-text skeleton-effect-wave` : ``}`"
                                >{{ item.timeframes[selectedTimeframe].current }}hrs</span
                            >
                        </div>
                    </div>
                    <div class="card__footer">
                        <div class="card__footer__previous-data">
                            <span :class="`card__footer-previous-period ${loading ? `skeleton skeleton-text skeleton-effect-wave` : ``}`">
                                Last {{ selectedTimeframe }} - {{ item.timeframes[selectedTimeframe].previous }}hrs
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

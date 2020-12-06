<template>
  <!-- <v-container fluid ma-0 pa-0 class="success lighten-4" md-6> -->
  <!-- <v-container class="grey lighten-1"> -->
  <!-- <v-layout row wrap>  -->
  <!-- <v-flex xs12 md6>
            <v-btn outline block class="primary"> 1</v-btn>
        </v-flex>
        <v-flex xs4 md2>
            <v-btn outline block class="primary"> 2</v-btn>
        </v-flex>
                <v-flex xs4 md2>
            <v-btn outline block class="primary"> 2</v-btn>
        </v-flex>
                <v-flex xs4 md2>
            <v-btn outline block class="primary"> 2</v-btn>
        </v-flex> -->
  <!-- </v-layout> -->
  <!-- <div class="d-flex flex-cloumn mb-6">
            <v-card
            v-for="n in 3"
            :key="n"
            class="pa-2"
            outlined
            tile>
            flex item {{n}}
        </v-card>
    </div> -->
  <!-- </v-container> -->
  <!-- <v-list>
          <v-list-item>
              <v-list-item-content>
                  1
              </v-list-item-content>
          </v-list-item>
      </v-list> -->
  <!-- <v-card
            v-for="n in 3"
            :key="n"
            class="pa-2"
            outlined
            tile>
            flex item {{n}}
        </v-card> -->
  <v-container fill-height class="grey lighten-3" flex>
    <div id="main">
      <div id="message-content" >
        <v-list full-height color="purple lighten-3" class="scrollable">
          <div
            v-for="n in 10"
            :key="n"
            outlined
            class="primary pa-2 ma-2 d-flex flex-row"
            :class="n % 2 === 1 ? '' : 'flex-row-reverse'"
          >
            <div
              id="message-box"
              outline
              class="pa-2 orange"
              style="
                max-width: 60%;
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
              "
              :style="
                n % 2 === 1
                  ? `border-bottom-right-radius: 1rem;`
                  : `border-bottom-left-radius: 1rem;`
              "
            >
              flex item {{ n }}
              {{ message }}
            </div>
          </div>
          <!-- <v-list-item v-for="n in 3" :key="n"> -->
          <!-- <v-card outlined
            class="pa-2 primary rounded-tl-xl rounded-tr-xl" 
            :class="n/2 === 1? `rounded-bl-xl text-right`: `rounded-br-xl`">

            flex item {{ n }}
          </v-card> -->
          <!-- <v-list-item-content fluid
            outlined
            class="pa-2 primary rounded-tl-xl rounded-tr-xl">
            <v-card
                outlined
                class="orange" witdh="20%">
            flex item {{n}}
            </v-card>
          </v-list-item-content> -->
          <!-- <div outlined class="primary pa-2 align-right">
              hello
          </div>
        </v-list-item> -->
        </v-list>
      </div>
      <div>
        <v-textarea id="input"
          backgroud-color="light-blue"
          color="black"
          label="label"
          rows="5"
          no-resize
          outlined
          md12
        >
          {{ message }}
        </v-textarea>
      </div>
      <!-- </v-layout> -->
    </div>
    <!-- </v-col>
      
    </v-row> -->
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      message:
        " 123 Regardless of whether the asynchronous operation completes immediately or not, the handler will not be invoked from within this function. On immediate completion, invocation of the handler will be performed in a manner equivalent to using post.",
    };
  },
};
</script>

<style>
.scrollable {
  overflow-y: auto;
  height: 60vh;
}
.v-container {
  background-color: bisque;
  /* border-bottom-left-radius: ; */
  height: 100%;
  overflow: hidden;
}
#main {
  height: 100%;
  max-height: 100%;
  /* background-color: coral; */
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
#message-content {
  background-color: dark;
  flex: 1;
  /* overflow:hidden;
  overflow-y: scroll; */
  /* height: 60%; */
}
/* #input {
    flex: 1 1 auto;
    overflow-y: auto;
    height: 0px;
} */
.v-row {
  height: 100%;
}
.v-list {
  width: 100%;
}
.v-list-item {
  width: 100%;
}
.v-card {
  width: 100%;
}
/* #message-box{
    width: 50%;
} */
</style>
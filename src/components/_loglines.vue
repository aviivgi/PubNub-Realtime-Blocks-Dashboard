<template>
  <div class="row mt-4">
    <div class="loglines">
      <div class="col-md-12">
        <table class="table table-responsive tableLogs">
          <thead>
            <tr>
              <th>#</th>
              <th>TimeStamp</th>
              <th>Type</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in myLoglines" :key="index" :class="item[1]">
              <th scope="row">{{index}}</th>
              <td>{{item['timetoken']}}</td>
              <td>{{item['type']}}</td>
              <td data-toggle="tooltip" data-placement="top" title="Tooltip on top">{{item['message']}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['myLoglines']
}
</script>

<style scoped>
  .log {
    /* background-color: blue; */
    color: blue;
  }
  .other {
    /* background-color: blue; */
    color: gray;
  }
  .error {
    background-color: red;
    color: white;
    border: 1px solid red;
  }
  .block {
    background-color:black;
  }
  .block.stopped {
    color: red;
  }
  .block.running {
    color: green;
  }
  .block.pending {
    color: orange;
  }
  .event_handler {
    background-color:darkolivegreen;
  }
  .event_handler.stopped {
    color: red;
  }
  .event_handler.running {
    color: greenyellow;
  }
  .event_handler.pending {
    color: orange;
  }

  .channels {
    color: darkgoldenrod;
  }

</style>

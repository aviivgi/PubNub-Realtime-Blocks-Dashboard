<template>
  <div>
    <div class="row mt-4 mb-1">
      <div class="col-12 form-inline mb-4">
          <div class="form-group">
            <label for="filter" class="sr-only">Filter</label>
            <input type="text" class="form-control" v-model="filter" placeholder="Filter">
          </div>
      </div>
    </div>
    <datatable :columns="table_columns" :data="myLoglines" :filter-by="filter" class="table-responsive">
      <template slot-scope="{ row }">
        <tr :class="row.type" class="logline">
            <td>{{ row.timetoken }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.feature }}</td>
            <td>{{ row.message | truncate(200) }}</td>
        </tr>
    </template>
    </datatable>
    <div class="row">
      <div class="col-12 form-inline">
          <datatable-pager v-model="page" type="abbreviated" :per-page="per_page"></datatable-pager>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['myLoglines'],
  data () {
    return {
      table_columns: [
        // {label: 'Address',
        //   representedAs: function (row) {
        //     return row().index()
        //   }
        // },
        {label: 'Timetoken', field: 'timetoken'},
        {label: 'Type', field: 'type'},
        {label: 'Feature', field: 'feature'},
        {label: 'Message', field: 'message'}
      ],
      per_page: 10,
      filter: '',
      page: 1
    }
  },
  filters: {
    truncate: function (string, value) {
      let tmp = JSON.stringify(string)
      tmp = tmp.substr(0, value) + '...'
      return tmp
    }
  }
}
</script>

<style scoped>
  .table-striped tbody tr:nth-of-type(odd) {
  }
  .log {
    /* background-color: blue; */
    color: blue;
  }
  .other {
    /* background-color: blue; */
    color: gray;
  }
  .error {
    color: red;
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

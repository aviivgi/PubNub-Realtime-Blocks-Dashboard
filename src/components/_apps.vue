<template>
  <div class="row mt-4">
    <div class="col-md-12">
      <ul class="list-group">
        <li class="list-group-item active">Related Apps (by permission)</li>
        <li class="list-group-item">
          <!-- Button trigger modal -->
          <template v-for="(app, index) in myApps">
            <div class="app d-inline-block mr-1 mb-1" v-bind:key=index>
              <button type="button" class="btn btn-primary" :class="getGroup(app.owner_id)" data-toggle="modal" :data-target="getModal(app.id)">
                {{ app.owner_id }} - {{ app.name }}
              </button>
              <div class="modal fade" :id="app.id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{{ app.name }} / {{ app.owner_id }} / {{ app.id }}</h5>
                      <button type="button" class="close" :class="getGroup(app.owner_id)" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">X</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <!-- {{ app }} -->
                      Stats: {{ app.stats_channel }}
                      <ul class="list-group" v-for="(key, index) in app.keys" v-bind:key=index>
                        <li class="list-group-item active">{{ key.id }} - {{ key.properties.name }} [{{ app.id }} / {{ key.status }}]</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">realtime_analytics_channel: </span>
                          {{ key.properties.realtime_analytics_channel }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">apns_bundle_id: </span>
                          {{ key.properties.apns_bundle_id }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">apns_sandbox: </span>
                          {{ key.properties.apns_sandbox }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">apns_use_token: </span>
                          {{ key.properties.apns_use_token }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">bill_by_uuid: </span>
                          {{ key.properties.bill_by_uuid }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">blocks: </span>
                          {{ key.properties.blocks }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">channelgroup_index_disable: </span>
                          {{ key.properties.bill_by_uuid }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">history: </span>
                          {{ key.properties.history }}</li>
                        <li class="list-group-item">
                          <span class="font-weight-bold">message_storage_ttl: </span>
                          {{ key.properties.message_storage_ttl }}</li>
                        <li class="list-group-item text-danger">{{ key.publish_key }}</li>
                        <li class="list-group-item text-success">{{ key.subscribe_key }}</li>
                        <li class="list-group-item text-info">{{ key.secret_key }}</li>
                      </ul>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
      <!-- Modal -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['myApps'],
  methods: {
    getModal (id) {
      return '#' + id
    },
    getGroup (id) {
      return 'group-' + id
    }
  }
}
</script>

<style>

</style>

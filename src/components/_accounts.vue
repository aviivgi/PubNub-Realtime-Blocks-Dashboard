<template>
  <div class="row mt-4">
      <div class="col-md-12">
        <!-- Button trigger modal -->
        <ul class="list-group">
          <li class="list-group-item active">Related Accounts (by permission)</li>
          <li class="list-group-item">
            <template v-for="(account, index) in myAccounts">
              <div class="account d-inline-block mr-1 mb-1" v-bind:key=index>
                <button type="button" class="btn btn-primary" :class="getGroup(account.id)" data-toggle="modal" :data-target="getModal(account.owner_id)">
                  O:{{ account.owner_id }} / A:{{ account.id }} / {{ account.properties.company }}
                </button>
                <div class="modal fade" :id="account.owner_id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">OWNER ID: {{ account.owner_id }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">X</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        {{ account }}
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
  props: ['myAccounts'],
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

<template>
  <div class="row mt-4">
    <div class="col-md-12">
      <ul class="list-group">
        <li class="list-group-item active">Related Blocks (by permission)</li>
        <li class="list-group-item">
          <!-- Button trigger modal -->
          <template v-for="(block, index) in myBlocks">
            <div class="block d-inline-block mr-1 mb-1" v-bind:key=index>
              <button type="button" class="btn btn-primary" :class="getGroup(block.create_user_id)" data-toggle="modal" :data-target="getModal(block.id)">
                <!-- {{ block.create_user_id }} - {{ block.key_id }} - -->
                {{ block.id }} - {{ block.name }}
              </button>
              <div class="modal fade" :id="block.id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">{{ block.name }} / {{ block.status }}</h5>
                      <button type="button" class="close" :class="getGroup(block.create_user_id)" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">X</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p><span class="font-weight-bold">create_user_id:</span> {{ block.create_user_id }}</p>
                      <p><span class="font-weight-bold">intended_state:</span> {{ block.intended_state }}</p>
                      <p><span class="font-weight-bold">modified_date:</span> {{ block.modified_date }}</p>
                      <p><span class="font-weight-bold">state:</span> {{ block.state }}</p>
                      <p><span class="font-weight-bold">status:</span> {{ block.status }}</p>
                      <p><span class="font-weight-bold">state_change_date:</span> {{ block.state_change_date }}</p>
                      <!-- {{ block }} -->
                      <p><span class="font-weight-bold">Description:</span> {{ block.description }}</p>
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
  props: ['myBlocks'],
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

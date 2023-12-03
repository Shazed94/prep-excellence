import Vue from 'vue';
import { DraggableTree, depthFirstSearch } from '@jambonn/vue-nested-draggable';
//Vue.use(depthFirstSearch);
Vue.component('draggable-tree', DraggableTree);
Vue.component('depthFirstSearch', depthFirstSearch);


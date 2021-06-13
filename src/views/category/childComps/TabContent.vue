<template>
</template>

<script>

import Scroll from 'components/common/scroll/Scroll'
import TabContentCategory from 'views/category/childComps/TabContentCategory'
import TabContentDetail from 'views/category/childComps/TabContentDetail'
	export default {
		name: "TabContent",
    components: {
		  Scroll,
      TabContentCategory,
      TabContentDetail
    },
    props: {
      subcategories: {
        type: Object,
        default() {
          return {}
        }
      },
      categoryDetail: {
        type: Array,
        default() {
          return []
        }
      }
    }
	}
</script>
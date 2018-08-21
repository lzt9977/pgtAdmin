<template>
    <Sider hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto', paddingTop: '64px'}">
       
        <Menu ref="sideMenu" :active-name="$route.name" theme="light" width="auto" :open-names="openName" @on-select="changeMenu">
            <template v-for="item in menuList">
                <MenuItem :name="item.children[0].name" v-if="item.children.length<=1" :lv="item.children[0].name">
                    <Icon :type="item.children[0].icon || item.icon" :key="'menuicon' + item.name"></Icon>
                    <span class="layout-text" :key="'title' + item.name">{{ item.title }}</span>
                </MenuItem>
                <Submenu v-if="item.children.length>1" :name="item.name" :lv="item.name" :key="item.name">
                    <template slot="title">
                        <Icon :type="item.icon"></Icon>
                        <span class="layout-text">{{ item.title }}</span>
                    </template>
                    <template v-for="child in item.children">
                        <MenuItem :name="child.name" :key="'menuitem' + child.name">
                            <Icon :type="child.icon" :key="'icon' + child.name"></Icon>
                            <span class="layout-text" :key="'title' + child.name">{{ child.title }}</span>
                        </MenuItem>
                    </template>
                </Submenu>
            </template>
        </Menu>
    </Sider>
</template>
<script>
export default {
    data () {
        return {
            openName:[]
        }
    },
    computed: {
        menuList () {
            return this.$store.state.app.menuList;
        }
    },
    methods: {
        changeMenu (active) {
            this.$router.push({name:active})
        },
        init () {
            this.$store.commit('updateMenulist');
        }
    },
    watch: {
        '$route' (to) {
            
        }
    },
    mounted () {
        this.init();
        let name = this.$route.name
        this.$store.state.app.routers.forEach(item => {
            if(item.children.length === 1){

            }else{
                item.children.forEach(child => {
                    if (child.name === name) {
                        this.openName.push(item.name)
                    }
                });
            }
        });
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
                this.$refs.sideMenu.updateActiveName();
            }
        });
    }
}
</script>

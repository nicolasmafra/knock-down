let menuData = {
    title: "Main Menu",
    children: {
        "hide": {
            title: "Hide main menu",
            action: () => menuLib.hide(),
        },
        "level-list": {
            title: "Select Level",
            children: {
                "hide": {
                    title: "Hide select-level menu",
                    action: () => menuLib.hide(),
                },
                "back": {
                    title: "Back",
                    action: () => menuLib.back(),
                },
            }
        },
    }
};

const menuLib = {
    stack: [],
    component: null,
    invisibleClass: 'menu-invisible',
    titleClass: 'menu-title',
    itemClass: 'menu-item',

    select: function(menuKey) {
        this.stack.push(menuKey);
        this.render();
    },

    back: function() {
        this.stack.pop();
        this.render();
    },

    currentMenu: function() {
        let current = menuData;
        this.stack.forEach(menuKey => current = current.children[menuKey]);
        return current;
    },

    show: function() {
        this.render();
        this.component.classList.remove(this.invisibleClass);
    },

    hide: function() {
        this.component.classList.add(this.invisibleClass);
    },

    render: function() {
        let current = this.currentMenu();
        this.component.innerHTML = '';

        let titleElement = document.createElement("div");
        titleElement.innerHTML = current.title;
        titleElement.classList.add(this.titleClass);
        this.component.appendChild(titleElement);

        Object.entries(current.children).forEach(([key, menuItem]) => {
            let element = document.createElement("div");
            element.innerHTML = menuItem.title;
            element.classList.add(this.itemClass);

            let action = menuItem.action
                ? menuItem.action
                : () => this.select(key);
            element.addEventListener('click', action);

            this.component.appendChild(element);
        });
    },
};
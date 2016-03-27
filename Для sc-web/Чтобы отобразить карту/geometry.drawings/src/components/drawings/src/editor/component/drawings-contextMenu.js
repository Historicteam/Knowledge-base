Drawings.ContextMenu = function (selector, event) {
    this.selector = selector;
    this.event = event;
    this.id = Drawings.Utils.randomUUID();
};

Drawings.ContextMenu.prototype = {

    show: function (items) {
        var menu = this._buildMenu(items);
        $('body').append(menu);

        var contextMenu = this;
        $(document).on('click', 'html', function () {
            contextMenu.hide();
        });

        var autoH = menu.height() + 12;

        if ((this.event.pageY + autoH) > $('html').height()) {
            menu.css({
                top: this.event.pageY - 20 - autoH,
                left: this.event.pageX - 13
            }).show();
        }
        else {
            menu.css({
                top: this.event.pageY + 10,
                left: this.event.pageX - 13
            }).show();
        }
    },

    hide: function () {
        $('#' + this.id).remove();
    },

    _buildMenu: function (items) {
        var menu = $('<ul class="contextMenu" id="' + this.id + '"></ul>');

        for (var i = 0; i < items.length; i++) {
            var menuItem = this._buildMenuItem(items[i]);
            menu.append(menuItem);
        }

        return menu;
    },

    _buildMenuItem: function (item) {
        var menuItem = $('<li><a tabindex="-1" href="#">' + item.text + '</a></li>');

        var actionId = Drawings.Utils.randomUUID();

        menuItem.find('a').attr('id', actionId);
        $(document).on('click', '#' + actionId, item.action);

        return menuItem;
    }
};
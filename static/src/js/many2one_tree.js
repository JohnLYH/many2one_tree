openerp.many2one_tree = function(instance, local) {
    var _t = instance.web._t,
        _lt = instance.web._lt;
    var QWeb = instance.web.qweb;

    local.Many2OneTree = instance.web.form.AbstractField.extend({

        events: {
            'click #tree_open_link': 'open_tree',
            'click #tree_close_link': 'close_tree',
        },

        init: function () {
            var self = this;
            this._super.apply(this, arguments);
            if (this.options.middle_node_select  === undefined) {
                this.middle_node_select = true;
            } else {
                this.middle_node_select = this.options.middle_node_select;
            }

            this._parent_id = self.options.parent_id || 'parent_id';
            this._child_ids = self.options.child_ids || 'child_ids';
        },

        close_tree: function(e) {
            $.jstree.destroy();
            this.$("#tree_open_link").show();
            this.$("#tree_close_link").hide();
        },

        open_tree: function (e) {
            var self  = this;
            this.$("#tree").show();
            this.$("#tree_open_link").hide();
            this.$("#tree_close_link").show();

            this.$("#tree").jstree({'core': { 'data': function(node, cb) {
                self.load_node(node, cb, self);
            }}});

            this.$("#tree").on("changed.jstree", function(e, data) {
                record = data.instance.get_selected(true)[0];
                if (record.data && record.data.has_children && !self.middle_node_select) {
                    self.$("#tree").jstree('toggle_node', record);
                    e.stopPropagation('changed.jstree');
                } else {
                    self.set_value([record.id, record.text]) ;
                    self.render_value();
                    self.$("#tree_open_link").show();
                }
            });

        },

        load_node: function(node, cb, self) {
            var data;

            if (node.id === "#") {
                domain = [[self._parent_id, '=', false]];
                self.fetch_node(domain, cb);

            } else {
                domain = [[self._parent_id, '=', parseInt(node.id)]];
                self.fetch_node(domain, cb);
            }
        },


        fetch_node: function(domain, cb) {
            var self = this;
            var model_obj = new instance.web.Model(this.field.relation);
            return model_obj.query(['name', this._parent_id, this._child_ids]).filter(domain).all().then( function(records) {
                var data = [];
                _.each(records, function(record) {
                    var node = {'text': record.name, 'id': record.id};
                    if (record[self._child_ids].length > 0) {
                        node.children = true;
                        node.icon = 'glyphicon glyphicon-align-justify';
                        node.data = {'has_children': true};
                    } else {
                        node.icon = false;
                    }
                    data.push(node);
                });
                return data;
            }).then(function(data) {
                cb(data);
            });
        },

        start: function() {
            this.on("change:effective_readonly", this, function() {
                this.display_field();
                this.render_value();
            });
            this.display_field();
            return this._super();
        },

        reinit_value: function (val) {
            this.internal_set_value(val);
            this.render_value();
        },

        set_value: function (value_) {
            var self = this;
            if (value_ instanceof Array) {
                this.display_value = {};
                this.display_value["" + value_[0]] = value_[1];
                value_ = value_[0];
            }
            value_ = value_ || false;
            this.reinit_value(value_);
        },

        display_field: function() {
            var self = this;
            this.$el.html(QWeb.render("Many2OneTree", {widget: this}));
            if (! this.get("effective_readonly")) {
                this.$("input").change(function() {
                    self.internal_set_value(self.$("input").val());
                });
            }
        },

        display_string: function(str) {
            var self = this;

            if (this.get("effective_readonly")) {
                var link = str ;
                var $link = this.$el.find('.oe_form_uri')
                    .unbind('click')
                    .html(link);
                $link.click(function () {
                    var context = new instance.web.CompoundContext();
                    var model_obj = new instance.web.Model(self.field.relation);
                    model_obj.call('get_formview_action', [self.get("value"), context]).then(function (action) {
                        self.do_action(action);
                    });
                });


            } else {
                this.$("#tree").hide();
                this.$("#span_content").text(str);
                this.$("#tree_link").show();
                this.$("#tree_close_link").hide();
            }
        },

        render_value: function() {
            value = this.get('value');
            var self = this;
            if (! this.get("value")) {
                this.display_string("");
                return;
            }

            var display = this.display_value["" + this.get('value')];
            if (display) {
                this.display_string(display);
                return;
            }

        },
    });

    instance.web.form.widgets.add('many2one_tree', 'instance.many2one_tree.Many2OneTree');
};

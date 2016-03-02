## odoo tree widget for many2one field


## Description

odoo widget for many2one field, provide a tree to select value, like the following screenshot.

![tree](/tree.png)

## How to use 

The related model must have parent_id and child_ids field.

For example:

    parent_id = fields.Many2one('YOUR STRING', 'Parent')
    child_ids = fields.One2many('YOUR MODEL', 'parent_id', string="YOUR STRING")

Than in the form view, set `widget='many2one_tree'`. Like this:

    <field name="location_id" widget="many2one_tree"/> 

## Options

In some situlation, One may want middle node can't be selected, you can achieve this by set middle_node_select to false for this field. Like this:

        <field name="location_id" widget="many2one_tree" options="{'middle_node_select': False}"/> 


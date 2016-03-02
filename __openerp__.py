# -*- coding: utf-8 -*-
{
    'name': "many2one_tree",

    'summary': """
        odoo tree widget for many2one field
        """,

    'description': """
        odoo tree widget for many2one field
    """,

    'author': "Li Feng",
    'website': "https://github.com/lifenglifeng001/many2one_tree",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/openerp/addons/base/module/module_data.xml
    # for the full list
    'category': 'Tools',
    'version': '8.0',
    'license': 'AGPL-3',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
    ],
    # only loaded in demonstration mode
    'demo': [
    ],

    'qweb': ['static/src/xml/*.xml'],
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/list');

require('../plugins/list');

utils = pi.utils;

pi.ActionList = (function(_super) {
  __extends(ActionList, _super);

  function ActionList() {
    return ActionList.__super__.constructor.apply(this, arguments);
  }

  ActionList.include_plugins(pi.List.Selectable, pi.List.Searchable, pi.List.Sortable, pi.List.Filterable, pi.List.ScrollEnd);

  return ActionList;

})(pi.List);

pi.Guesser.rules_for('action_list', ['pi-action-list']);



},{"../core":33,"../plugins/list":49,"./base/list":6}],2:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../core/pi');

require('./pieces');

utils = pi.utils;

pi.App = (function() {
  function App() {}

  App.prototype.initialize = function(nod) {
    var _ref;
    this.view = pi.piecify(nod || pi.Nod.root);
    return (_ref = this.page) != null ? _ref.initialize() : void 0;
  };

  return App;

})();

pi.app = new pi.App();

module.exports = pi.app;



},{"../core/pi":35,"./pieces":12}],3:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../pieces');

utils = pi.utils;

pi.BaseInput = (function(_super) {
  __extends(BaseInput, _super);

  function BaseInput() {
    return BaseInput.__super__.constructor.apply(this, arguments);
  }

  BaseInput.prototype.postinitialize = function() {
    return this.input || (this.input = this.node.nodeName === 'INPUT' ? this : this.find('input'));
  };

  BaseInput.prototype.value = function(val) {
    if (this === this.input) {
      return BaseInput.__super__.value.apply(this, arguments);
    } else {
      if (val != null) {
        this.input.node.value = val;
        return this;
      } else {
        return this.input.node.value;
      }
    }
  };

  BaseInput.prototype.clear = function() {
    return this.input.value('');
  };

  return BaseInput;

})(pi.Base);



},{"../../core":33,"../pieces":12}],4:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../pieces');

utils = pi.utils;

pi.Button = (function(_super) {
  __extends(Button, _super);

  function Button() {
    return Button.__super__.constructor.apply(this, arguments);
  }

  return Button;

})(pi.Base);

pi.Guesser.rules_for('button', ['pi-button'], ['button', 'a', 'input[button]']);



},{"../../core":33,"../pieces":12}],5:[function(require,module,exports){
'use strict';
require('./base_input');

require('./button');

require('./list');

require('./textinput');



},{"./base_input":3,"./button":4,"./list":6,"./textinput":7}],6:[function(require,module,exports){
'use strict';
var pi, utils, _renderer_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../pieces');

utils = pi.utils;

_renderer_reg = /(\w+)(?:\(([\w\-\/]+)\))?/;

pi.List = (function(_super) {
  __extends(List, _super);

  function List() {
    return List.__super__.constructor.apply(this, arguments);
  }

  List.string_matcher = function(string) {
    var query, regexp, selectors, _ref;
    if (string.indexOf(":") > 0) {
      _ref = string.split(":"), selectors = _ref[0], query = _ref[1];
      regexp = new RegExp(query, 'i');
      selectors = selectors.split(',');
      return function(item) {
        var selector, _i, _len, _ref1;
        for (_i = 0, _len = selectors.length; _i < _len; _i++) {
          selector = selectors[_i];
          if (!!((_ref1 = item.find(selector)) != null ? _ref1.text().match(regexp) : void 0)) {
            return true;
          }
        }
        return false;
      };
    } else {
      regexp = new RegExp(string, 'i');
      return function(item) {
        return !!item.text().match(regexp);
      };
    }
  };

  List.object_matcher = function(obj, all) {
    var key, val, _fn;
    if (all == null) {
      all = true;
    }
    _fn = (function(_this) {
      return function(key, val) {
        if (typeof val === "object") {
          return obj[key] = _this.object_matcher(val, all);
        } else if (!(typeof val === 'function')) {
          return obj[key] = function(value) {
            return val === value;
          };
        }
      };
    })(this);
    for (key in obj) {
      val = obj[key];
      _fn(key, val);
    }
    return function(item) {
      var matcher, _any;
      _any = false;
      for (key in obj) {
        matcher = obj[key];
        if (item[key] != null) {
          if (matcher(item[key])) {
            _any = true;
            if (!all) {
              return _any;
            }
          } else {
            if (all) {
              return false;
            }
          }
        }
      }
      return _any;
    };
  };

  List.prototype.preinitialize = function() {
    List.__super__.preinitialize.apply(this, arguments);
    this.list_klass = this.options.list_klass || 'list';
    this.item_klass = this.options.item_klass || 'item';
    this.items = [];
    return this.buffer = document.createDocumentFragment();
  };

  List.prototype.initialize = function() {
    List.__super__.initialize.apply(this, arguments);
    this.item_renderer || (this.item_renderer = this._setup_renderer());
    this.items_cont = this.find("." + this.list_klass) || this;
    return this.parse_html_items();
  };

  List.prototype.postinitialize = function() {
    this._check_empty();
    if (this.options.noclick == null) {
      return this.listen("." + this.item_klass, "click", (function(_this) {
        return function(e) {
          if (!utils.clickable(e.origTarget)) {
            if (_this._item_clicked(e.target)) {
              return e.cancel();
            }
          }
        };
      })(this));
    }
  };

  List.prototype.parse_html_items = function() {
    this.items_cont.each("." + this.item_klass, (function(_this) {
      return function(node) {
        return _this.add_item(pi.Nod.create(node));
      };
    })(this));
    return this._flush_buffer(false);
  };

  List.prototype.data_provider = function(data) {
    var item, _i, _len;
    if (data == null) {
      data = null;
    }
    if (this.items.length) {
      this.clear();
    }
    if (data != null) {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        this.add_item(item, false);
      }
    }
    return this.update('load');
  };

  List.prototype.add_item = function(data, update) {
    var item;
    if (update == null) {
      update = true;
    }
    item = this._create_item(data);
    if (item == null) {
      return;
    }
    this.items.push(item);
    this._check_empty();
    item.data('list-index', this.items.length - 1);
    if (update) {
      this.items_cont.append(item);
    } else {
      this.buffer.appendChild(item.node);
    }
    if (update) {
      return this.trigger('update', {
        type: 'item_added',
        item: item
      });
    }
  };

  List.prototype.add_item_at = function(data, index, update) {
    var item, _after;
    if (update == null) {
      update = true;
    }
    if (this.items.length - 1 < index) {
      this.add_item(data, update);
      return;
    }
    item = this._create_item(data);
    this.items.splice(index, 0, item);
    _after = this.items[index + 1];
    item.data('list-index', index);
    _after.insertBefore(item);
    this._need_update_indeces = true;
    if (update) {
      this._update_indeces();
      return this.trigger('update', {
        type: 'item_added',
        item: item
      });
    }
  };

  List.prototype.remove_item = function(item, update) {
    var index;
    if (update == null) {
      update = true;
    }
    index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this._destroy_item(item);
      this._check_empty();
      this._need_update_indeces = true;
      if (update) {
        this._update_indeces();
        this.trigger('update', {
          type: 'item_removed',
          item: item
        });
      }
    }
  };

  List.prototype.remove_item_at = function(index, update) {
    var item;
    if (update == null) {
      update = true;
    }
    if (this.items.length - 1 < index) {
      return;
    }
    item = this.items[index];
    return this.remove_item(item, update);
  };

  List.prototype.update_item = function(item, data, update) {
    var new_item;
    if (update == null) {
      update = true;
    }
    new_item = this.item_renderer.render(data);
    utils.extend(item.record, new_item.record, true);
    item.html(new_item.html());
    item.mergeClasses(new_item);
    if (update) {
      this.trigger('update', {
        type: 'item_updated',
        item: item
      });
    }
    return item;
  };

  List.prototype.where = function(query) {
    var item, matcher, _i, _len, _ref, _results;
    matcher = typeof query === "string" ? this.constructor.string_matcher(query) : this.constructor.object_matcher(query);
    _ref = this.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (matcher(item)) {
        _results.push(item);
      }
    }
    return _results;
  };

  List.prototype.size = function() {
    return this.items.length;
  };

  List.prototype.update = function(type) {
    this._flush_buffer();
    if (this._need_update_indeces) {
      this._update_indeces();
    }
    this._check_empty();
    return this.trigger('update', {
      type: type
    });
  };

  List.prototype.clear = function() {
    this.items_cont.detach_children();
    this.items.length = 0;
    return this.trigger('update', {
      type: 'clear'
    });
  };

  List.prototype._update_indeces = function() {
    var i, item, _i, _len, _ref;
    _ref = this.items;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      item = _ref[i];
      item.data('list-index', i);
    }
    return this._need_update_indeces = false;
  };

  List.prototype._check_empty = function() {
    if (!this.empty && this.items.length === 0) {
      this.addClass('is-empty');
      this.empty = true;
      return this.trigger('empty', true);
    } else if (this.empty && this.items.length > 0) {
      this.removeClass('is-empty');
      this.empty = false;
      return this.trigger('empty', false);
    }
  };

  List.prototype._create_item = function(data) {
    var item;
    if (data instanceof pi.Nod && data.is_list_item) {
      if (data.host === this) {
        return data;
      } else {
        return null;
      }
    }
    item = this.item_renderer.render(data);
    item.is_list_item = true;
    item.host = this;
    return item;
  };

  List.prototype._destroy_item = function(item) {
    item.remove();
    return item.dispose();
  };

  List.prototype._setup_renderer = function() {
    var klass, name, param, _, _ref;
    if ((this.options.renderer != null) && _renderer_reg.test(this.options.renderer)) {
      _ref = this.options.renderer.match(_renderer_reg), _ = _ref[0], name = _ref[1], param = _ref[2];
      klass = pi.List.Renderers[utils.camelCase(name)];
      if (klass != null) {
        return new klass(param);
      }
    }
    return new pi.List.Renderers.Base();
  };

  List.prototype._flush_buffer = function(append) {
    if (append == null) {
      append = true;
    }
    if (append) {
      this.items_cont.append(this.buffer);
    }
    return this.buffer.innerHTML = '';
  };

  List.prototype._item_clicked = function(target) {
    var item;
    if (!target.is_list_item) {
      return;
    }
    item = target;
    if (item && item.host === this) {
      this.trigger('item_click', {
        item: item
      });
      return true;
    }
  };

  return List;

})(pi.Base);

pi.List.Renderers = {};

pi.List.Renderers.Base = (function() {
  function Base() {}

  Base.prototype.render = function(nod) {
    return this._render(nod, nod.data());
  };

  Base.prototype._render = function(nod, data) {
    if (!(nod instanceof pi.Base)) {
      nod = nod.piecify();
    }
    nod.record = data;
    return nod;
  };

  return Base;

})();

pi.Guesser.rules_for('list', ['pi-list'], ['ul'], function(nod) {
  return nod.children('ul').length === 1;
});



},{"../../core":33,"../pieces":12}],7:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../pieces');

require('./base_input');

utils = pi.utils;

pi.TextInput = (function(_super) {
  __extends(TextInput, _super);

  function TextInput() {
    return TextInput.__super__.constructor.apply(this, arguments);
  }

  TextInput.prototype.postinitialize = function() {
    TextInput.__super__.postinitialize.apply(this, arguments);
    this.editable = true;
    if (this.options.readonly || this.hasClass('is-readonly')) {
      return this.readonly();
    }
  };

  TextInput.prototype.edit = function() {
    if (!this.editable) {
      this.input.attr('readonly', null);
      this.removeClass('is-readonly');
      this.editable = true;
      this.trigger('editable', true);
    }
    return this;
  };

  TextInput.prototype.readonly = function() {
    if (this.editable) {
      this.input.attr('readonly', 'readonly');
      this.addClass('is-readonly');
      this.editable = false;
      this.blur();
      this.trigger('editable', false);
    }
    return this;
  };

  return TextInput;

})(pi.BaseInput);

pi.Guesser.rules_for('text_input', ['pi-text-input-wrap'], ['input[text]']);



},{"../../core":33,"../pieces":12,"./base_input":3}],8:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

utils = pi.utils;

pi.Checkbox = (function(_super) {
  __extends(Checkbox, _super);

  function Checkbox() {
    return Checkbox.__super__.constructor.apply(this, arguments);
  }

  Checkbox.prototype.postinitialize = function() {
    Checkbox.__super__.postinitialize.apply(this, arguments);
    this.attr('tabindex', 0);
    this.selected = false;
    if (this.options.selected || this.hasClass('is-selected') || (this.value() | 0)) {
      this.select();
    }
    return this.on('click', (function(_this) {
      return function() {
        return _this.toggle_select();
      };
    })(this));
  };

  Checkbox.prototype.select = function() {
    if (!this.selected) {
      this.addClass('is-selected');
      this.selected = true;
      this.input.value(1);
      return this.trigger('selected', true);
    }
  };

  Checkbox.prototype.deselect = function() {
    if (this.selected) {
      this.removeClass('is-selected');
      this.selected = false;
      this.input.value(0);
      return this.trigger('selected', false);
    }
  };

  Checkbox.prototype.toggle_select = function() {
    if (this.selected) {
      return this.deselect();
    } else {
      return this.select();
    }
  };

  return Checkbox;

})(pi.BaseInput);

pi.Guesser.rules_for('checkbox', ['pi-checkbox-wrap'], null);



},{"../core":33,"./base/base_input":3}],9:[function(require,module,exports){
'use strict';
var pi, utils, _name_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

utils = pi.utils;

_name_reg = /([^\/\\]+$)/;

pi.FileInput = (function(_super) {
  __extends(FileInput, _super);

  function FileInput() {
    return FileInput.__super__.constructor.apply(this, arguments);
  }

  FileInput.prototype.initialize = function() {
    FileInput.__super__.initialize.apply(this, arguments);
    return this._files = [];
  };

  FileInput.prototype.postinitialize = function() {
    FileInput.__super__.postinitialize.apply(this, arguments);
    this.input.attr('tabindex', '-1');
    return this.input.on('change', (function(_this) {
      return function() {
        var file, _i, _len, _ref;
        _this._files.length = 0;
        if (_this.input.node.files == null) {
          if (_this.input.node.value) {
            _this._files.push({
              name: _this.input.node.value.split(_name_reg)[1]
            });
            _this.trigger('files_selected', _this._files);
          }
          return;
        }
        if (_this.input.node.files.length) {
          _ref = _this.input.node.files;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            _this._files.push(file);
          }
          return _this.trigger('files_selected', _this._files);
        } else {
          return _this.clear();
        }
      };
    })(this));
  };

  FileInput.prototype.multiple = function(value) {
    if (value) {
      return this.input.attr('multiple', '');
    } else {
      return this.input.attr('multiple', null);
    }
  };

  FileInput.prototype.clear = function() {
    FileInput.__super__.clear.apply(this, arguments);
    return this._files.length = 0;
  };

  FileInput.prototype.files = function() {
    return this._files;
  };

  return FileInput;

})(pi.BaseInput);

pi.Guesser.rules_for('file_input', ['pi-file-input-wrap'], ['input[file]'], function(nod) {
  return nod.children("input[type=file]").length === 1;
});



},{"../core":33,"./base/base_input":3}],10:[function(require,module,exports){
'use strict';
var pi, utils,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;

pi = require('../../core');

utils = pi.utils;

pi.Guesser = (function() {
  function Guesser() {}

  Guesser.klasses = [];

  Guesser.klass_reg = null;

  Guesser.klass_to_component = {};

  Guesser.tag_to_component = {};

  Guesser.specials = {};

  Guesser.compile_klass_reg = function() {
    if (!this.klasses.length) {
      return this.klass_reg = null;
    } else {
      return this.klass_reg = new RegExp("(" + this.klasses.map(function(klass) {
        return "(\\b" + (utils.escapeRegexp(klass)) + "\\b)";
      }).join("|") + ")", "g");
    }
  };

  Guesser.rules_for = function(component_name, klasses, tags, fun) {
    var klass, tag, _base, _i, _j, _len, _len1;
    if (klasses == null) {
      klasses = [];
    }
    if (tags == null) {
      tags = [];
    }
    if (klasses.length) {
      for (_i = 0, _len = klasses.length; _i < _len; _i++) {
        klass = klasses[_i];
        this.klass_to_component[klass] = component_name;
        this.klasses.push(klass);
      }
      this.compile_klass_reg();
    }
    if (tags.length) {
      for (_j = 0, _len1 = tags.length; _j < _len1; _j++) {
        tag = tags[_j];
        ((_base = this.tag_to_component)[tag] || (_base[tag] = [])).push(component_name);
      }
    }
    if (typeof fun === 'function') {
      return this.specials[component_name] = fun;
    }
  };

  Guesser.find = function(nod) {
    var el, m, match, matches, resolver, tag, tmatches, _i, _j, _len, _len1, _match, _ref, _ref1;
    matches = [];
    if (this.klass_reg && (_match = nod.node.className.match(this.klass_reg))) {
      matches = utils.uniq(_match);
      if (matches.length === 1) {
        return this.klass_to_component[matches[0]];
      }
    }
    matches = matches.map((function(_this) {
      return function(klass) {
        return _this.klass_to_component[klass];
      };
    })(this));
    tag = nod.node.nodeName.toLowerCase();
    if (tag === 'input') {
      tag += "[" + nod.node.type + "]";
    }
    if (this.tag_to_component[tag] != null) {
      tmatches = [];
      if (matches.length) {
        _ref = this.tag_to_component[tag];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          if ((__indexOf.call(matches, el) >= 0)) {
            tmatches.push(el);
          }
        }
      } else {
        tmatches = this.tag_to_component[tag];
      }
      tmatches = utils.uniq(tmatches);
      if (tmatches.length === 1) {
        return tmatches[0];
      } else {
        matches = tmatches;
      }
    }
    if (matches.length) {
      for (_j = 0, _len1 = matches.length; _j < _len1; _j++) {
        m = matches[_j];
        if ((this.specials[m] != null) && this.specials[m].call(null, nod)) {
          return m;
        }
      }
      return matches[matches.length - 1];
    } else {
      _ref1 = this.specials;
      for (match in _ref1) {
        if (!__hasProp.call(_ref1, match)) continue;
        resolver = _ref1[match];
        if (resolver.call(null, nod)) {
          return match;
        }
      }
    }
    return 'base';
  };

  return Guesser;

})();



},{"../../core":33}],11:[function(require,module,exports){
'use strict';
require('./pieces');

require('./app');

require('./guess/guesser');

require('./base/index');

require('../plugins/index');

require('./renderers');

require('./action_list');

require('./checkbox');

require('./file_input');

require('./progress_bar');

require('./search_input');

require('./select_input');

require('./swf_player');

require('./textarea');

require('./toggle_button');



},{"../plugins/index":47,"./action_list":1,"./app":2,"./base/index":5,"./checkbox":8,"./file_input":9,"./guess/guesser":10,"./pieces":12,"./progress_bar":13,"./renderers":14,"./search_input":17,"./select_input":18,"./swf_player":19,"./textarea":20,"./toggle_button":21}],12:[function(require,module,exports){
'use strict';
var Nod, event_re, pi, utils, _array_rxp, _call_reg, _condition_regexp, _conditional, _fun_reg, _method_reg, _null, _op_reg, _operators, _str_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

pi = require('../core');

utils = pi.utils;

Nod = pi.Nod;

utils.extend(pi.Nod.prototype, {
  find_cut: function(selector) {
    var acc, el, rest;
    rest = [];
    acc = [];
    el = this.node.firstChild;
    while (el) {
      if (el.nodeType !== 1) {
        el = el.nextSibling || rest.shift();
        continue;
      }
      if (el.matches(selector)) {
        acc.push(el);
      } else {
        el.firstChild && rest.unshift(el.firstChild);
      }
      el = el.nextSibling || rest.shift();
    }
    return acc;
  }
});

_array_rxp = /\[\]$/;

pi.Base = (function(_super) {
  __extends(Base, _super);

  Base.include_plugins = function() {
    var plugin, plugins, _i, _len, _results;
    plugins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = plugins.length; _i < _len; _i++) {
      plugin = plugins[_i];
      _results.push(plugin.included(this));
    }
    return _results;
  };

  Base.requires = function() {
    var components;
    components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.before_create(function() {
      var cmp, _results;
      _results = [];
      while (components.length) {
        cmp = components.pop();
        if (this[cmp] === void 0) {
          throw Error("Missing required component " + cmp);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

  function Base(node, host, options) {
    this.node = node;
    this.host = host;
    this.options = options != null ? options : {};
    Base.__super__.constructor.apply(this, arguments);
    this.preinitialize();
    this.__initialize();
    this.init_plugins();
    this.init_children();
    this.setup_events();
    this.__postinitialize();
  }

  Base.prototype.piecify = function() {
    var c, _i, _len, _ref, _results;
    this.init_children();
    _ref = this.__components__;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push(c.piecify());
    }
    return _results;
  };

  Base.prototype.trigger = function(event, data, bubbles) {
    if (this.enabled || event === 'enabled') {
      return Base.__super__.trigger.call(this, event, data, bubbles);
    }
  };

  Base.prototype.bubble_event = function(event) {
    if (this.host != null) {
      return this.host.trigger(event);
    }
  };

  Base.prototype.show = function() {
    if (!this.visible) {
      this.removeClass('is-hidden');
      this.visible = true;
      this.trigger('hidden', false);
    }
    return this;
  };

  Base.prototype.hide = function() {
    if (this.visible) {
      this.addClass('is-hidden');
      this.visible = false;
      this.trigger('hidden', true);
    }
    return this;
  };

  Base.prototype.enable = function() {
    if (!this.enabled) {
      this.removeClass('is-disabled');
      this.enabled = true;
      this.trigger('enabled', true);
    }
    return this;
  };

  Base.prototype.disable = function() {
    if (this.enabled) {
      this.addClass('is-disabled');
      this.enabled = false;
      this.trigger('enabled', false);
    }
    return this;
  };

  Base.prototype.activate = function() {
    if (!this.active) {
      this.addClass('is-active');
      this.active = true;
      this.trigger('active', true);
    }
    return this;
  };

  Base.prototype.deactivate = function() {
    if (this.active) {
      this.removeClass('is-active');
      this.active = false;
      this.trigger('active', false);
    }
    return this;
  };

  Base.prototype.preinitialize = function() {
    this.node._nod = this;
    this.__components__ = [];
    this.pid = this.data('pid') || this.attr('pid') || this.node.id;
    this.visible = this.enabled = true;
    return this.active = false;
  };

  Base.prototype.__initialize = function() {
    return this.initialize();
  };

  Base.prototype.initialize = function() {
    if (this.options.disabled || this.hasClass('is-disabled')) {
      this.disable();
    }
    if (this.options.hidden || this.hasClass('is-hidden')) {
      this.hide();
    }
    if (this.options.active || this.hasClass('is-active')) {
      this.activate();
    }
    this._initialized = true;
    return this.trigger('initialized', true, false);
  };

  Base.register_callback('__initialize', {
    as: 'initialize'
  });

  Base.prototype.init_plugins = function() {
    var name, _i, _len, _ref;
    if (this.options.plugins != null) {
      _ref = this.options.plugins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this.attach_plugin(this.find_plugin(name));
      }
      delete this.options.plugins;
    }
  };

  Base.prototype.attach_plugin = function(plugin) {
    if (plugin != null) {
      utils.debug("plugin attached " + plugin.prototype.id);
      return plugin.attached(this);
    }
  };

  Base.prototype.find_plugin = function(name) {
    var klass, _ref;
    name = utils.camelCase(name);
    klass = this.constructor;
    while ((klass != null)) {
      if (klass[name] != null) {
        return klass[name];
      }
      klass = (_ref = klass.__super__) != null ? _ref.constructor : void 0;
    }
    utils.warning("plugin not found: " + name);
    return null;
  };

  Base.prototype.init_children = function() {
    var node, _fn, _i, _len, _ref;
    _ref = this.find_cut('.pi');
    _fn = (function(_this) {
      return function(node) {
        var child, _name;
        child = pi.init_component(node, _this);
        if (child.pid) {
          if (_array_rxp.test(child.pid)) {
            (_this[_name = child.pid.slice(0, -2)] || (_this[_name] = [])).push(child);
          } else {
            _this[child.pid] = child;
          }
          return _this.__components__.push(child);
        }
      };
    })(this);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      _fn(node);
    }
  };

  Base.prototype.setup_events = function() {
    var event, handler, handlers, _i, _len, _ref, _ref1;
    _ref = this.options.events;
    for (event in _ref) {
      handlers = _ref[event];
      _ref1 = handlers.split(/;\s*/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        handler = _ref1[_i];
        this.on(event, pi.str_to_event_handler(handler, this));
      }
    }
    delete this.options.events;
  };

  Base.prototype.__postinitialize = function() {
    return this.postinitialize();
  };

  Base.prototype.postinitialize = function() {
    return this.trigger('creation_complete', true, false);
  };

  Base.register_callback('__postinitialize', {
    as: 'create'
  });

  Base.prototype.dispose = function() {
    Base.__super__.dispose.apply(this, arguments);
    if ((this.pid != null) && (this.host != null)) {
      delete this.host[this.pid];
    }
  };

  return Base;

})(pi.Nod);

event_re = /^on_(.+)/i;

pi._guess_component = function(nod) {
  var component, component_name;
  component_name = nod.data('component') || pi.Guesser.find(nod);
  component = utils.get_class_path(pi, component_name);
  if (component == null) {
    return utils.error("unknown or initialized component " + component_name);
  } else {
    utils.debug("component created: " + component_name);
    return component;
  }
};

pi._gather_options = function(el) {
  var key, matches, opts, val;
  opts = utils.clone(el.data());
  opts.plugins = opts.plugins != null ? opts.plugins.split(/\s+/) : null;
  opts.events = {};
  for (key in opts) {
    val = opts[key];
    if (matches = key.match(event_re)) {
      opts.events[matches[1]] = val;
    }
  }
  return opts;
};

pi.init_component = function(nod, host) {
  var component;
  nod = nod instanceof Nod ? nod : Nod.create(nod);
  component = pi._guess_component(nod);
  if (nod instanceof component) {
    return nod;
  } else {
    return new component(nod.node, host, pi._gather_options(nod));
  }
};

_method_reg = /([\w\.]+)\.(\w+)/;

pi.call = function(component, method_chain, fixed_args) {
  var arg, error, key_, method, method_, target, target_, target_chain, _, _ref, _ref1;
  try {
    utils.debug("pi call: component - " + component + "; method chain - " + method_chain);
    target = (function() {
      switch (false) {
        case typeof component !== 'object':
          return component;
        case component[0] !== '@':
          return pi.find(component.slice(1));
        default:
          return this[component];
      }
    }).call(this);
    if (!method_chain) {
      return target;
    }
    _ref = (function() {
      var _fn, _i, _len, _ref, _ref1;
      if (method_chain.indexOf(".") < 0) {
        return [method_chain, target];
      } else {
        _ref = method_chain.match(_method_reg), _ = _ref[0], target_chain = _ref[1], method_ = _ref[2];
        target_ = target;
        _ref1 = target_chain.split('.');
        _fn = function(key_) {
          return target_ = typeof target_[key_] === 'function' ? target_[key_].call(target_) : target_[key_];
        };
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key_ = _ref1[_i];
          _fn(key_);
        }
        return [method_, target_];
      }
    })(), method = _ref[0], target = _ref[1];
    if (((_ref1 = target[method]) != null ? _ref1.call : void 0) != null) {
      return target[method].apply(target, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = fixed_args.length; _i < _len; _i++) {
          arg = fixed_args[_i];
          _results.push(typeof arg === 'function' ? arg.apply(this) : arg);
        }
        return _results;
      }).call(this));
    } else {
      return target[method];
    }
  } catch (_error) {
    error = _error;
    return utils.error(error);
  }
};

_str_reg = /^['"].+['"]$/;

pi.prepare_arg = function(arg, host) {
  if (_method_reg.test(arg) || arg[0] === '@') {
    return pi.str_to_fun(arg, host);
  } else {
    if (_str_reg.test(arg)) {
      return arg.slice(1, -1);
    } else {
      return utils.serialize(arg);
    }
  }
};

_condition_regexp = /^([\w\.\(\)@'"-=><]+)\s*\?\s*([\w\.\(\)@'"-]+)\s*(?:\:\s*([\w\.\(\)@'"-]+)\s*)$/;

_fun_reg = /^(@?\w+)(?:\.([\w\.]+)(?:\(([@\w\.\(\),'"-]+)\))?)?$/;

_op_reg = /(>|<|=)/;

_operators = {
  ">": function(left, right) {
    return function() {
      var a, args, b;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      a = (typeof left.apply === "function" ? left.apply(this, args) : void 0) || left;
      b = (typeof right.apply === "function" ? right.apply(this, args) : void 0) || right;
      return a > b;
    };
  },
  "<": function(left, right) {
    return function() {
      var a, args, b;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      a = (typeof left.apply === "function" ? left.apply(this, args) : void 0) || left;
      b = (typeof right.apply === "function" ? right.apply(this, args) : void 0) || right;
      return a < b;
    };
  },
  "=": function(left, right) {
    return function() {
      var a, args, b;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      a = (typeof left.apply === "function" ? left.apply(this, args) : void 0) || left;
      b = (typeof right.apply === "function" ? right.apply(this, args) : void 0) || right;
      return a === b;
    };
  }
};

_conditional = function(condition, resolve, reject) {
  return function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (condition.apply(this, args)) {
      return resolve.apply(this, args);
    } else {
      return reject.apply(this, args);
    }
  };
};

_null = function() {
  return true;
};

_call_reg = /\(\)/;

pi.str_to_fun = function(callstr, host) {
  var condition, matches, reject, resolve;
  callstr = callstr.replace(_call_reg, '');
  if ((matches = callstr.match(_condition_regexp))) {
    condition = pi.compile_condition(matches[1], host);
    resolve = pi.compile_fun(matches[2], host);
    reject = matches[3] ? pi.compile_fun(matches[3], host) : _null;
    return _conditional(condition, resolve, reject);
  } else {
    return pi.compile_fun(callstr, host);
  }
};

pi.compile_condition = function(callstr, host) {
  var matches, parts;
  if ((matches = callstr.match(_op_reg))) {
    parts = callstr.split(_op_reg);
    return _operators[matches[1]](pi.prepare_arg(parts[0]), pi.prepare_arg(parts[2]));
  } else {
    return pi.compile_fun(callstr, host);
  }
};

pi.compile_fun = function(callstr, host) {
  var arg, matches, target;
  matches = callstr.match(_fun_reg);
  target = (function() {
    switch (false) {
      case matches[1] !== '@this':
        return host;
      case matches[1] !== '@app':
        return pi.app;
      case matches[1] !== '@host':
        return host.host;
      case matches[1] !== '@view':
        return host.view();
      default:
        return matches[1];
    }
  })();
  if (matches[2]) {
    return utils.curry(pi.call, [
      target, matches[2], (matches[3] ? (function() {
        var _i, _len, _ref, _results;
        _ref = matches[3].split(",");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arg = _ref[_i];
          _results.push(pi.prepare_arg(arg, host));
        }
        return _results;
      })() : [])
    ]);
  } else {
    return utils.curry(pi.call, [target, void 0, void 0]);
  }
};

pi.str_to_event_handler = function(callstr, host) {
  var _f;
  callstr = callstr.replace(/\be\b/, "e");
  _f = pi.str_to_fun(callstr, host);
  return function(e) {
    return _f.call({
      e: e
    });
  };
};

pi.piecify = function(nod, host) {
  return pi.init_component(nod, host || nod.parent('.pi'));
};

pi.event = new pi.EventDispatcher();

pi.find = function(pid_path) {
  return utils.get_path(pi.app.view, pid_path);
};

utils.extend(Nod.prototype, {
  piecify: function(host) {
    return pi.piecify(this, host);
  },
  pi_call: function(target, action) {
    if (!this._pi_call || this._pi_action !== action) {
      this._pi_action = action;
      this._pi_call = pi.str_to_fun(action, target);
    }
    return this._pi_call.call(null);
  }
});

Nod.root.ready(function() {
  return Nod.root.listen('a', 'click', function(e) {
    if (e.target.attr("href")[0] === "@") {
      utils.debug("handle pi click: " + (e.target.attr("href")));
      e.target.pi_call(e.target, e.target.attr("href"));
      e.cancel();
    }
  });
});

pi.$ = function(q) {
  if (q[0] === '@') {
    return pi.find(q.slice(1));
  } else if (utils.is_html(q)) {
    return Nod.create(q);
  } else {
    return Nod.root.find(q);
  }
};

pi["export"](pi.$, '$');

return;



},{"../core":33}],13:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./pieces');

utils = pi.utils;

pi.ProgressBar = (function(_super) {
  __extends(ProgressBar, _super);

  function ProgressBar() {
    return ProgressBar.__super__.constructor.apply(this, arguments);
  }

  ProgressBar.prototype.start = function(target) {
    this.value = 0;
    return this.show();
  };

  ProgressBar.prototype.set = function(value) {
    this.value = value;
    return this.style({
      width: "" + value + "%"
    });
  };

  ProgressBar.prototype.simulate = function(speed) {
    if (speed == null) {
      speed = 200;
    }
    return this._sid = utils.after(speed, (function(_this) {
      return function() {
        _this.set(_this.value + (100 - _this.value) / 2);
        return _this.simulate(speed);
      };
    })(this));
  };

  ProgressBar.prototype.reset = function() {
    this._sid && clearTimeout(this._sid);
    this.style({
      width: 0
    });
    return this.hide();
  };

  ProgressBar.prototype.stop = function() {
    this._sid && clearTimeout(this._sid);
    this.style({
      width: "101%"
    });
    return utils.after(200, (function(_this) {
      return function() {
        _this.style({
          width: 0
        });
        return _this.hide();
      };
    })(this));
  };

  return ProgressBar;

})(pi.Base);

pi.Guesser.rules_for('progress_bar', ['pi-progressbar']);



},{"../core":33,"./pieces":12}],14:[function(require,module,exports){
'use strict';
require('./jst');

require('./mustache');



},{"./jst":15,"./mustache":16}],15:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../base/list');

utils = pi.utils;

pi.List.Renderers.Jst = (function(_super) {
  __extends(Jst, _super);

  function Jst(template) {
    this.templater = JST[template];
  }

  Jst.prototype.render = function(data) {
    var nod;
    nod = pi.Nod.create(this.templater(data));
    return this._render(nod, data);
  };

  return Jst;

})(pi.List.Renderers.Base);



},{"../../core":33,"../base/list":6}],16:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../base/list');

utils = pi.utils;

pi.List.Renderers.Mustache = (function(_super) {
  __extends(Mustache, _super);

  function Mustache(template) {
    var tpl_nod;
    if (window.Mustache == null) {
      throw Error('Mustache not found');
    }
    tpl_nod = $("#" + template);
    if (tpl_nod == null) {
      throw Error("Template #" + template + " not found!");
    }
    this.template = utils.trim(tpl_nod.html());
    window.Mustache.parse(this.template);
  }

  Mustache.prototype.render = function(data) {
    var nod;
    nod = pi.Nod.create(window.Mustache.render(this.template, data));
    return this._render(nod, data);
  };

  return Mustache;

})(pi.List.Renderers.Base);



},{"../../core":33,"../base/list":6}],17:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/textinput');

utils = pi.utils;

pi.SearchInput = (function(_super) {
  __extends(SearchInput, _super);

  function SearchInput() {
    return SearchInput.__super__.constructor.apply(this, arguments);
  }

  SearchInput.prototype.postinitialize = function() {
    SearchInput.__super__.postinitialize.apply(this, arguments);
    return this.input.on('keyup', debounce(300, this._query, this));
  };

  SearchInput.prototype._query = function() {
    var val;
    if (!this.active) {
      this.activate();
    }
    val = this.value();
    utils.debug("query: " + val);
    this.trigger('query', val);
    if (!val) {
      return this.deactivate();
    }
  };

  SearchInput.prototype.reset = function() {
    this.value('');
    this.deactivate();
    return this.trigger('query', '');
  };

  return SearchInput;

})(pi.TextInput);

pi.Guesser.rules_for('search_input', ['pi-search-field']);



},{"../core":33,"./base/textinput":7}],18:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

utils = pi.utils;

pi.SelectInput = (function(_super) {
  __extends(SelectInput, _super);

  function SelectInput() {
    return SelectInput.__super__.constructor.apply(this, arguments);
  }

  SelectInput.requires('dropdown');

  SelectInput.prototype.postinitialize = function() {
    SelectInput.__super__.postinitialize.apply(this, arguments);
    this.attr('tabindex', '0');
    if (!this.dropdown.has_selectable) {
      this.dropdown.attach_plugin(pi.List.Selectable);
    }
    this.dropdown.selectable.type('radio');
    this.dropdown.on('selected', (function(_this) {
      return function(e) {
        _this.value(e.data[0].record.value);
        return _this.trigger('change', e.data[0].record);
      };
    })(this));
    this.on('focus', (function(_this) {
      return function() {
        return _this.dropdown.show();
      };
    })(this));
    return this.on('blur', (function(_this) {
      return function() {
        return _this.dropdown.hide();
      };
    })(this));
  };

  return SelectInput;

})(pi.BaseInput);

pi.Guesser.rules_for('select_input', ['pi-select-field'], null);



},{"../core":33,"./base/base_input":3}],19:[function(require,module,exports){
'use strict';
var pi, utils, _swf_count,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

pi = require('../core');

require('./pieces');

utils = pi.utils;

_swf_count = 0;

pi.SwfPlayer = (function(_super) {
  __extends(SwfPlayer, _super);

  function SwfPlayer() {
    return SwfPlayer.__super__.constructor.apply(this, arguments);
  }

  SwfPlayer.prototype.initialize = function() {
    var cont, _base;
    cont = document.createElement('div');
    this.player_id = "swf_player_" + (++_swf_count);
    cont.id = this.player_id;
    this.append(cont);
    (_base = this.options).version || (_base.version = "11.0.0");
    if ((this.options.url != null) && this.enabled) {
      this.load(this.options.url);
    }
    return SwfPlayer.__super__.initialize.apply(this, arguments);
  };

  SwfPlayer.prototype.load = function(url, params) {
    var key, val, _ref;
    if (params == null) {
      params = {};
    }
    url || (url = this.options.url);
    _ref = this.options;
    for (key in _ref) {
      val = _ref[key];
      if (!params[key]) {
        params[key] = val;
      }
    }
    return swfobject.embedSWF(url, this.player_id, "100%", "100%", this.options.version, "", params, {
      allowScriptAccess: true,
      wmode: 'transparent'
    });
  };

  SwfPlayer.prototype.clear = function() {
    return this.empty();
  };

  SwfPlayer.prototype.as3_call = function() {
    var args, method, obj, _ref;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    obj = swfobject.getObjectById(this.player_id);
    if (obj) {
      return (_ref = obj[method]) != null ? _ref.apply(obj, args) : void 0;
    }
  };

  SwfPlayer.prototype.as3_event = function(e) {
    utils.debug(e);
    return this.trigger('as3_event', e);
  };

  return SwfPlayer;

})(pi.Base);



},{"../core":33,"./pieces":12}],20:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/textinput');

utils = pi.utils;

pi.TextArea = (function(_super) {
  __extends(TextArea, _super);

  function TextArea() {
    return TextArea.__super__.constructor.apply(this, arguments);
  }

  TextArea.prototype.postinitialize = function() {
    this.input = this.node.nodeName === 'TEXTAREA' ? this : this.find('textarea');
    TextArea.__super__.postinitialize.apply(this, arguments);
    if (this.options.autosize === true) {
      return this.enable_autosize();
    }
  };

  TextArea.prototype.autosizer = function() {
    return this._autosizer || (this._autosizer = (function(_this) {
      return function() {
        return _this.input.height(_this.input.node.scrollHeight);
      };
    })(this));
  };

  TextArea.prototype.enable_autosize = function() {
    if (!this._autosizing) {
      this.input.on('change', this.autosizer());
      this._autosizing = true;
      this.autosizer()();
    }
    return this;
  };

  TextArea.prototype.disable_autosize = function() {
    if (this._autosizing) {
      this.input.style('height', null);
      this.input.off('change', this.autosizer());
      this._autosizing = false;
    }
    return this;
  };

  return TextArea;

})(pi.TextInput);

pi.Guesser.rules_for('text_area', ['pi-textarea'], ['textarea']);



},{"../core":33,"./base/textinput":7}],21:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/button');

require('../plugins/base/selectable');

utils = pi.utils;

pi.ToggleButton = (function(_super) {
  __extends(ToggleButton, _super);

  function ToggleButton() {
    return ToggleButton.__super__.constructor.apply(this, arguments);
  }

  ToggleButton.include_plugins(pi.Base.Selectable);

  return ToggleButton;

})(pi.Button);

pi.Guesser.rules_for('toggle_button', ['pi-toggle-button']);



},{"../core":33,"../plugins/base/selectable":46,"./base/button":4}],22:[function(require,module,exports){
'use strict';
var app, pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

utils = pi.utils;

pi.controllers = {};

app = pi.app;

pi.controllers.Base = (function(_super) {
  __extends(Base, _super);

  Base.has_resource = function(resource) {
    if (resource.resources_name == null) {
      return;
    }
    return this.prototype[resource.resources_name] = resource;
  };

  Base.prototype.id = 'base';

  function Base(view) {
    this.view = view;
    this._initialized = false;
  }

  Base.prototype.initialize = function() {
    return this._initialized = true;
  };

  Base.prototype.load = function(data) {
    if (!this._initialized) {
      this.initialize();
    }
    this.view.loaded(data);
  };

  Base.prototype.unload = function() {
    this.view.unloaded();
  };

  Base.prototype.exit = function(data) {
    return app.page.switch_back(data);
  };

  Base.prototype["switch"] = function(to, data) {
    return app.page.switch_context(this.id, to, data);
  };

  return Base;

})(pi.Core);



},{"../core":33}],23:[function(require,module,exports){
'use strict';
require('./base');

require('./page');

require('./modules');

require('./list.controller');



},{"./base":22,"./list.controller":24,"./modules":25,"./page":27}],24:[function(require,module,exports){
'use strict';
var page, pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base');

require('./page');

require('./modules/scoped');

utils = pi.utils;

page = pi.app.page;

pi.controllers.ListController = (function(_super) {
  __extends(ListController, _super);

  function ListController() {
    return ListController.__super__.constructor.apply(this, arguments);
  }

  ListController.include(pi.controllers.Scoped);

  ListController.list_resource = function(resource) {
    this.prototype.resources = resource;
    return this.has_resource(resource);
  };

  ListController.prototype.id = 'list_base';

  ListController.prototype.initialize = function() {
    return ListController.__super__.initialize.apply(this, arguments);
  };

  ListController.prototype._action = function(action) {
    var params;
    params = utils.clone(this.scope().params);
    this.view.loading(true);
    return this.resources[action].call(this.resources, params)["catch"]((function(_this) {
      return function(error) {
        return _this.view.error(error.message);
      };
    })(this)).then((function(_this) {
      return function(response) {
        _this.view.loading(false);
        return response;
      };
    })(this)).then((function(_this) {
      return function(response) {
        if ((response != null ? response.message : void 0) != null) {
          _this.view.success(response.message);
        }
        return response;
      };
    })(this));
  };

  ListController.prototype.index = function(params) {
    if (params == null) {
      params = {};
    }
    this.scope().set(params);
    return this._action('fetch').then((function(_this) {
      return function(data) {
        _this.view.reload(data);
        return data;
      };
    })(this));
  };

  ListController.prototype.search = function(q) {
    this.scope().set({
      q: q
    });
    if (this.scope().is_full) {
      return this.view.search(q);
    } else {
      return this._action('query').then((function(_this) {
        return function(data) {
          _this.view.reload(data);
          _this.view.searched(q);
          return data;
        };
      })(this));
    }
  };

  ListController.prototype.sort = function(params) {
    var sort_params;
    if (params == null) {
      params = null;
    }
    sort_params = {
      sort: params
    };
    this.scope().set(sort_params);
    if (this.scope().is_full) {
      return this.view.sort(params);
    } else {
      return this._action('query').then((function(_this) {
        return function(data) {
          _this.view.reload(data);
          _this.view.sorted(params);
          return data;
        };
      })(this));
    }
  };

  ListController.prototype.filter = function(params) {
    var filter_params;
    if (params == null) {
      params = null;
    }
    filter_params = {
      filter: params
    };
    this.scope().set(filter_params);
    if (this.scope().is_full) {
      return this.view.filter(params);
    } else {
      return this._action('query').then((function(_this) {
        return function(data) {
          _this.view.reload(data);
          _this.view.filtered(params);
          return data;
        };
      })(this));
    }
  };

  return ListController;

})(pi.controllers.Base);



},{"../core":33,"./base":22,"./modules/scoped":26,"./page":27}],25:[function(require,module,exports){
'use strict';
require('./scoped');



},{"./scoped":26}],26:[function(require,module,exports){
'use strict';
var Scope, pi, utils,
  __hasProp = {}.hasOwnProperty;

pi = require('../../core');

require('../base');

utils = pi.utils;

Scope = (function() {
  function Scope(whitelist, blacklist, rules) {
    this.whitelist = whitelist != null ? whitelist : [];
    this.blacklist = blacklist != null ? blacklist : [];
    this.rules = rules != null ? rules : {};
    this.is_full = false;
    this._scope = {};
    this.params = {};
  }

  Scope.prototype._filter_key = function(key) {
    if (this.whitelist.length) {
      return this.whitelist.indexOf(key) > -1;
    }
    if (this.blacklist.length) {
      return this.blacklist.indexOf(key) < 0;
    }
    return true;
  };

  Scope.prototype._merge = function(key, val) {
    if (val === null && (this._scope[key] != null)) {
      delete this._scope[key];
      this.is_full = false;
      return;
    }
    if (!this.is_full) {
      this._scope[key] = val;
    } else {
      this._scope[key] = this._resolve(key, this._scope[key], val);
    }
  };

  Scope.prototype._resolve = function(key, old_val, val) {
    var _base, _val;
    if (this.rules[key] == null) {
      this.is_full = false;
      return val;
    } else {
      _val = typeof (_base = this.rules)[key] === "function" ? _base[key](old_val, val) : void 0;
      if (_val === false) {
        this.is_full = false;
        return val;
      } else {
        return _val;
      }
    }
  };

  Scope.prototype.set = function(params) {
    var key, val, _ref, _results;
    if (params == null) {
      params = {};
    }
    for (key in params) {
      if (!__hasProp.call(params, key)) continue;
      val = params[key];
      if (this._filter_key(key)) {
        this.params[key] = val;
      }
    }
    _ref = this.params;
    _results = [];
    for (key in _ref) {
      val = _ref[key];
      _results.push((function(_this) {
        return function() {
          if (_this._scope[key] !== val) {
            return _this._merge(key, val);
          }
        };
      })(this)());
    }
    return _results;
  };

  Scope.prototype.clear = function() {
    this.params = {};
    return this._scope = {};
  };

  Scope.prototype.to_s = function() {
    var key, val, _ref, _ref1;
    _ref = [];
    _ref1 = this._scope;
    for (key in _ref1) {
      val = _ref1[key];
      _ref.push("" + key + "=" + val);
    }
    return _ref.join("&");
  };

  Scope.prototype.all_loaded = function() {
    utils.debug("Scope is full: " + (this.to_s()));
    return this.is_full = true;
  };

  Scope.prototype.reload = function() {
    utils.debug("Scope should be reloaded: " + (this.to_s()));
    return this.is_full = false;
  };

  return Scope;

})();

pi.controllers.Scoped = (function() {
  function Scoped() {}

  Scoped.included = function() {
    return true;
  };

  Scoped.prototype.scope = function() {
    return this._scope || (this._scope = new Scope());
  };

  return Scoped;

})();



},{"../../core":33,"../base":22}],27:[function(require,module,exports){
'use strict';
var History, pi, utils, _orig,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base');

utils = pi.utils;

History = require('../core/utils/history');

pi.controllers.Page = (function(_super) {
  __extends(Page, _super);

  function Page() {
    this._contexts = {};
    this.context_id = null;
    this._history = new History();
  }

  Page.prototype.add_context = function(controller, main) {
    this._contexts[controller.id] = controller;
    if (main) {
      return this._main_context_id = controller.id;
    }
  };

  Page.prototype.initialize = function() {
    return this.switch_context(null, this._main_context_id);
  };

  Page.prototype.switch_context = function(from, to, data, history) {
    if (history == null) {
      history = false;
    }
    if (from && from !== this.context_id) {
      utils.warning("trying to switch from non-active context");
      return;
    }
    if (!to || (this.context_id === to)) {
      return;
    }
    if (!this._contexts[to]) {
      utils.warning("undefined context: " + to);
      return;
    }
    utils.info("context switch: " + from + " -> " + to);
    if (this.context != null) {
      this.context.unload();
    }
    if ((from != null) && !history) {
      this._history.push(from);
    }
    this.context = this._contexts[to];
    this.context_id = to;
    this.context.load(data);
    return true;
  };

  Page.prototype.switch_to = function(to, data) {
    return this.switch_context(this.context_id, to, data);
  };

  Page.prototype.switch_back = function(data) {
    if (this.context != null) {
      return this.switch_context(this.context_id, this._history.pop(), data, history);
    }
  };

  Page.prototype.dispose = function() {
    this.context = null;
    this.context_id = null;
    this._contexts = {};
    return this._history.clear();
  };

  return Page;

})(pi.Core);

pi.app.page = new pi.controllers.Page();

_orig = pi.str_to_fun;

pi.str_to_fun = function(callstr, host) {
  if (callstr.slice(0, 2) === '@@') {
    callstr = "@app.page.context." + callstr.slice(2);
  }
  return _orig(callstr, host);
};



},{"../core":33,"../core/utils/history":37,"./base":22}],28:[function(require,module,exports){
'use strict';
var pi, utils,
  __slice = [].slice;

pi = require('./pi');

require('./utils');

utils = pi.utils;

pi.Core = (function() {
  function Core() {}

  Core.include = function() {
    var mixin, mixins, _i, _len, _results;
    mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = mixins.length; _i < _len; _i++) {
      mixin = mixins[_i];
      utils.extend(this.prototype, mixin.prototype, true, ['constructor']);
      _results.push(mixin.included(this));
    }
    return _results;
  };

  Core.extend = function() {
    var mixin, mixins, _i, _len, _results;
    mixins = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = mixins.length; _i < _len; _i++) {
      mixin = mixins[_i];
      utils.extend(this, mixin, true);
      _results.push(mixin.extended(this));
    }
    return _results;
  };

  Core.alias = function(from, to) {
    this.prototype[from] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this[to].apply(this, args);
    };
  };

  Core.class_alias = function(from, to) {
    this[from] = this[to];
  };

  Core.register_callback = function(method, options) {
    var callback_name, _fn, _i, _len, _orig, _ref, _when;
    if (options == null) {
      options = {};
    }
    callback_name = options.as || method;
    _ref = ["before", "after"];
    _fn = (function(_this) {
      return function(_when) {
        return _this["" + _when + "_" + callback_name] = function(callback) {
          var _name;
          return (this[_name = "_" + _when + "_" + callback_name] || (this[_name] = [])).push(callback);
        };
      };
    })(this);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _when = _ref[_i];
      _fn(_when);
    }
    _orig = this.prototype[method];
    return this.prototype[method] = function() {
      var args, res;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.run_callbacks("before_" + callback_name);
      res = _orig.apply(this, args);
      this.run_callbacks("after_" + callback_name);
      return res;
    };
  };

  Core.prototype.run_callbacks = function(type) {
    var callback, _i, _len, _ref, _results;
    _ref = this.constructor["_" + type] || [];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback.call(this));
    }
    return _results;
  };

  Core.prototype.delegate_to = function() {
    var method, methods, to, _fn, _i, _len;
    to = arguments[0], methods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    to = typeof to === 'string' ? this[to] : to;
    _fn = (function(_this) {
      return function(method) {
        return _this[method] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return to[method].apply(to, args);
        };
      };
    })(this);
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      method = methods[_i];
      _fn(method);
    }
  };

  return Core;

})();



},{"./pi":35,"./utils":38}],29:[function(require,module,exports){
'use strict';
var pi;

pi = require('../pi');

require('./nod_events');

pi.NodEvent.register_alias('mousewheel', 'DOMMouseScroll');



},{"../pi":35,"./nod_events":32}],30:[function(require,module,exports){
'use strict';
var pi, utils, _true, _types,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../pi');

require('../utils/index');

require('../core');

utils = pi.utils;

pi.Event = (function(_super) {
  __extends(Event, _super);

  function Event(event, target, bubbles) {
    this.target = target;
    if (bubbles == null) {
      bubbles = true;
    }
    if ((event != null) && typeof event === "object") {
      utils.extend(this, event);
    } else {
      this.type = event;
    }
    this.bubbles = bubbles;
    this.canceled = false;
  }

  Event.prototype.cancel = function() {
    return this.canceled = true;
  };

  return Event;

})(pi.Core);

_true = function() {
  return true;
};

pi.EventListener = (function(_super) {
  __extends(EventListener, _super);

  function EventListener(type, handler, context, disposable, conditions) {
    this.type = type;
    this.handler = handler;
    this.context = context != null ? context : null;
    this.disposable = disposable != null ? disposable : false;
    this.conditions = conditions;
    if (this.handler._uid == null) {
      this.handler._uid = "fun" + utils.uid();
    }
    this.uid = "" + this.type + ":" + this.handler._uid;
    if (typeof this.conditions !== 'function') {
      this.conditions = _true;
    }
    if (this.context != null) {
      if (this.context._uid == null) {
        this.context._uid = "obj" + utils.uid();
      }
      this.uid += ":" + this.context._uid;
    }
  }

  EventListener.prototype.dispatch = function(event) {
    if (this.disposed || !this.conditions(event)) {
      return;
    }
    this.handler.call(this.context, event);
    if (this.disposable) {
      return this.dispose();
    }
  };

  EventListener.prototype.dispose = function() {
    this.handler = this.context = this.conditions = null;
    return this.disposed = true;
  };

  return EventListener;

})(pi.Core);

_types = function(types) {
  if (typeof types === 'string') {
    return types.split(',');
  } else if (Array.isArray(types)) {
    return types;
  } else {
    return [null];
  }
};

pi.EventDispatcher = (function(_super) {
  __extends(EventDispatcher, _super);

  EventDispatcher.prototype.listeners = '';

  EventDispatcher.prototype.listeners_by_key = '';

  function EventDispatcher() {
    this.listeners = {};
    this.listeners_by_key = {};
  }

  EventDispatcher.prototype.on = function(types, callback, context, conditions) {
    var type, _i, _len, _ref, _results;
    _ref = _types(types);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      _results.push(this.add_listener(new pi.EventListener(type, callback, context, false, conditions)));
    }
    return _results;
  };

  EventDispatcher.prototype.one = function(type, callback, context, conditions) {
    return this.add_listener(new pi.EventListener(type, callback, context, true, conditions));
  };

  EventDispatcher.prototype.off = function(types, callback, context, conditions) {
    var type, _i, _len, _ref, _results;
    _ref = _types(types);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      _results.push(this.remove_listener(type, callback, context, conditions));
    }
    return _results;
  };

  EventDispatcher.prototype.trigger = function(event, data, bubbles) {
    var listener, _i, _len, _ref;
    if (bubbles == null) {
      bubbles = true;
    }
    if (!(event instanceof pi.Event)) {
      event = new pi.Event(event, this, bubbles);
    }
    if (data != null) {
      event.data = data;
    }
    event.currentTarget = this;
    if (this.listeners[event.type] != null) {
      utils.debug("Event: " + event.type, event);
      _ref = this.listeners[event.type];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener.dispatch(event);
        if (event.canceled === true) {
          break;
        }
      }
      this.remove_disposed_listeners();
    } else {
      if (event.bubbles) {
        this.bubble_event(event);
      }
    }
  };

  EventDispatcher.prototype.bubble_event = function(event) {};

  EventDispatcher.prototype.add_listener = function(listener) {
    var _base, _name;
    (_base = this.listeners)[_name = listener.type] || (_base[_name] = []);
    this.listeners[listener.type].push(listener);
    return this.listeners_by_key[listener.uid] = listener;
  };

  EventDispatcher.prototype.remove_listener = function(type, callback, context, conditions) {
    var listener, uid, _i, _len, _ref;
    if (context == null) {
      context = null;
    }
    if (conditions == null) {
      conditions = null;
    }
    if (type == null) {
      return this.remove_all();
    }
    if (this.listeners[type] == null) {
      return;
    }
    if (callback == null) {
      _ref = this.listeners[type];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener.dispose();
      }
      this.remove_type(type);
      this.remove_disposed_listeners();
      return;
    }
    uid = "" + type + ":" + callback._uid;
    if (context != null) {
      uid += ":" + context._uid;
    }
    listener = this.listeners_by_key[uid];
    if (listener != null) {
      delete this.listeners_by_key[uid];
      this.remove_listener_from_list(type, listener);
    }
  };

  EventDispatcher.prototype.remove_listener_from_list = function(type, listener) {
    if ((this.listeners[type] != null) && this.listeners[type].indexOf(listener) > -1) {
      this.listeners[type] = this.listeners[type].filter(function(item) {
        return item !== listener;
      });
      if (!this.listeners[type].length) {
        return this.remove_type(type);
      }
    }
  };

  EventDispatcher.prototype.remove_disposed_listeners = function() {
    var key, listener, _ref, _results;
    _ref = this.listeners_by_key;
    _results = [];
    for (key in _ref) {
      listener = _ref[key];
      if (listener.disposed) {
        this.remove_listener_from_list(listener.type, listener);
        _results.push(delete this.listeners_by_key[key]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  EventDispatcher.prototype.remove_type = function(type) {
    return delete this.listeners[type];
  };

  EventDispatcher.prototype.remove_all = function() {
    this.listeners = {};
    return this.listeners_by_key = {};
  };

  return EventDispatcher;

})(pi.Core);



},{"../core":28,"../pi":35,"../utils/index":38}],31:[function(require,module,exports){
'use strict';
require('./events');

require('./nod_events');

require('./aliases');



},{"./aliases":29,"./events":30,"./nod_events":32}],32:[function(require,module,exports){
'use strict';
var Events, NodEvent, pi, utils, _key_regexp, _mouse_regexp, _prepare_event, _selector, _selector_regexp,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../pi');

require('../utils');

require('./events');

utils = pi.utils;

Events = pi.Events || {};

pi.NodEvent = (function(_super) {
  __extends(NodEvent, _super);

  NodEvent.aliases = {};

  NodEvent.reversed_aliases = {};

  NodEvent.delegates = {};

  NodEvent.add = (function() {
    if (typeof Element.prototype.addEventListener === "undefined") {
      return function(nod, event, handler) {
        return nod.attachEvent("on" + event, handler);
      };
    } else {
      return function(nod, event, handler) {
        return nod.addEventListener(event, handler);
      };
    }
  })();

  NodEvent.remove = (function() {
    if (typeof Element.prototype.removeEventListener === "undefined") {
      return function(nod, event, handler) {
        return nod.detachEvent("on" + event, handler);
      };
    } else {
      return function(nod, event, handler) {
        return nod.removeEventListener(event, handler);
      };
    }
  })();

  NodEvent.register_delegate = function(type, delegate) {
    return this.delegates[type] = delegate;
  };

  NodEvent.has_delegate = function(type) {
    return !!this.delegates[type];
  };

  NodEvent.register_alias = function(from, to) {
    this.aliases[from] = to;
    return this.reversed_aliases[to] = from;
  };

  NodEvent.has_alias = function(type) {
    return !!this.aliases[type];
  };

  NodEvent.is_aliased = function(type) {
    return !!this.reversed_aliases[type];
  };

  function NodEvent(event) {
    this.event = event || window.event;
    this.origTarget = this.event.target || this.event.srcElement;
    this.target = pi.Nod.create(this.origTarget);
    this.type = this.constructor.is_aliased[event.type] ? this.constructor.reversed_aliases[event.type] : event.type;
    this.ctrlKey = this.event.ctrlKey;
    this.shiftKey = this.event.shiftKey;
    this.altKey = this.event.altKey;
    this.metaKey = this.event.metaKey;
    this.detail = this.event.detail;
    this.bubbles = this.event.bubbles;
  }

  NodEvent.prototype.stopPropagation = function() {
    if (this.event.stopPropagation) {
      return this.event.stopPropagation();
    } else {
      return this.event.cancelBubble = true;
    }
  };

  NodEvent.prototype.stopImmediatePropagation = function() {
    if (this.event.stopImmediatePropagation) {
      return this.event.stopImmediatePropagation();
    } else {
      this.event.cancelBubble = true;
      return this.event.cancel = true;
    }
  };

  NodEvent.prototype.preventDefault = function() {
    if (this.event.preventDefault) {
      return this.event.preventDefault();
    } else {
      return this.event.returnValue = false;
    }
  };

  NodEvent.prototype.cancel = function() {
    this.stopImmediatePropagation();
    this.preventDefault();
    return NodEvent.__super__.cancel.apply(this, arguments);
  };

  return NodEvent;

})(pi.Event);

NodEvent = pi.NodEvent;

_mouse_regexp = /(click|mouse|contextmenu)/i;

_key_regexp = /(keyup|keydown|keypress)/i;

pi.MouseEvent = (function(_super) {
  __extends(MouseEvent, _super);

  function MouseEvent() {
    MouseEvent.__super__.constructor.apply(this, arguments);
    this.button = this.event.button;
    if (this.pageX == null) {
      this.pageX = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      this.pageY = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    if (this.offsetX == null) {
      this.offsetX = this.event.layerX - this.origTarget.offsetLeft;
      this.offsetY = this.event.layerY - this.origTarget.offsetTop;
    }
    this.wheelDelta = this.event.wheelDelta;
    if (this.wheelDelta == null) {
      this.wheelDelta = -this.event.detail * 40;
    }
  }

  return MouseEvent;

})(NodEvent);

pi.KeyEvent = (function(_super) {
  __extends(KeyEvent, _super);

  function KeyEvent() {
    KeyEvent.__super__.constructor.apply(this, arguments);
    utils.debug('I am a KEEEY!');
    this.keyCode = this.event.keyCode || this.event.which;
    this.charCode = this.event.charCode;
  }

  return KeyEvent;

})(NodEvent);

_prepare_event = function(e) {
  if (_mouse_regexp.test(e.type)) {
    return new pi.MouseEvent(e);
  } else if (_key_regexp.test(e.type)) {
    return new pi.KeyEvent(e);
  } else {
    return new NodEvent(e);
  }
};

_selector_regexp = /[\.#]/;

_selector = function(s, parent) {
  if (!_selector_regexp.test(s)) {
    return function(e) {
      return e.target.node.matches(s);
    };
  } else {
    return function(e) {
      var node;
      parent || (parent = document);
      node = e.target.node;
      if (node.matches(s)) {
        return true;
      }
      while ((node = node.parentNode) !== parent) {
        if (node.matches(s)) {
          return (e.target = pi.Nod.create(node));
        }
      }
    };
  }
};

pi.NodEventDispatcher = (function(_super) {
  __extends(NodEventDispatcher, _super);

  function NodEventDispatcher() {
    NodEventDispatcher.__super__.constructor.apply(this, arguments);
    this.native_event_listener = (function(_this) {
      return function(event) {
        return _this.trigger(_prepare_event(event));
      };
    })(this);
  }

  NodEventDispatcher.prototype.listen = function(selector, event, callback, context) {
    return this.on(event, callback, context, _selector(selector));
  };

  NodEventDispatcher.prototype.add_native_listener = function(type) {
    if (NodEvent.has_delegate(type)) {
      return NodEvent.delegates[type].add(this.node, this.native_event_listener);
    } else {
      return NodEvent.add(this.node, type, this.native_event_listener);
    }
  };

  NodEventDispatcher.prototype.remove_native_listener = function(type) {
    if (NodEvent.has_delegate(type)) {
      return NodEvent.delegates[type].remove(this.node);
    } else {
      return NodEvent.remove(this.node, type, this.native_event_listener);
    }
  };

  NodEventDispatcher.prototype.add_listener = function(listener) {
    if (!this.listeners[listener.type]) {
      this.add_native_listener(listener.type);
      if (NodEvent.has_alias(listener.type)) {
        this.add_native_listener(NodEvent.aliases[listener.type]);
      }
    }
    return NodEventDispatcher.__super__.add_listener.apply(this, arguments);
  };

  NodEventDispatcher.prototype.remove_type = function(type) {
    this.remove_native_listener(type);
    if (NodEvent.has_alias(type)) {
      this.remove_native_listener(NodEvent.aliases[type]);
    }
    return NodEventDispatcher.__super__.remove_type.apply(this, arguments);
  };

  NodEventDispatcher.prototype.remove_all = function() {
    var list, type, _fn, _ref;
    _ref = this.listeners;
    _fn = (function(_this) {
      return function() {
        _this.remove_native_listener(type);
        if (NodEvent.has_alias(type)) {
          return _this.remove_native_listener(NodEvent.aliases[type]);
        }
      };
    })(this);
    for (type in _ref) {
      if (!__hasProp.call(_ref, type)) continue;
      list = _ref[type];
      _fn();
    }
    return NodEventDispatcher.__super__.remove_all.apply(this, arguments);
  };

  return NodEventDispatcher;

})(pi.EventDispatcher);



},{"../pi":35,"../utils":38,"./events":30}],33:[function(require,module,exports){
'use strict';
var pi;

pi = require('./pi');

require('./nod');

module.exports = pi;



},{"./nod":34,"./pi":35}],34:[function(require,module,exports){
'use strict';
var d, klasses, pi, prop, utils, _data_reg, _dataset, _fragment, _from_dataCase, _geometry_styles, _i, _len, _node, _prop_hash, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

pi = require('./pi');

require('./utils');

require('./events');

utils = pi.utils;

_prop_hash = function(method, callback) {
  return pi.Nod.prototype[method] = function(prop, val) {
    var k, p;
    if (typeof prop !== "object") {
      return callback.call(this, prop, val);
    }
    for (k in prop) {
      if (!__hasProp.call(prop, k)) continue;
      p = prop[k];
      callback.call(this, k, p);
    }
  };
};

_geometry_styles = function(sty) {
  var s, _fn, _i, _len;
  _fn = function() {
    var name;
    name = s;
    pi.Nod.prototype[name] = function(val) {
      if (val === void 0) {
        return this.node["offset" + (utils.capitalize(name))];
      }
      this.node.style[name] = Math.round(val) + "px";
      return this;
    };
  };
  for (_i = 0, _len = sty.length; _i < _len; _i++) {
    s = sty[_i];
    _fn();
  }
};

_node = function(n) {
  if (n instanceof pi.Nod) {
    return n.node;
  }
  if (typeof n === "string") {
    return _fragment(n);
  }
  return n;
};

_data_reg = /^data-\w[\w\-]*$/;

_from_dataCase = function(str) {
  var words;
  words = str.split('-');
  return words.join('_');
};

_dataset = (function() {
  if (typeof DOMStringMap === "undefined") {
    return function(node) {
      var attr, dataset, _i, _len, _ref;
      dataset = {};
      if (node.attributes != null) {
        _ref = node.attributes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          if (_data_reg.test(attr.name)) {
            dataset[_from_dataCase(attr.name.slice(5))] = utils.serialize(attr.value);
          }
        }
      }
      return dataset;
    };
  } else {
    return function(node) {
      var dataset, key, val, _ref;
      dataset = {};
      _ref = node.dataset;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        val = _ref[key];
        dataset[utils.snake_case(key)] = utils.serialize(val);
      }
      return dataset;
    };
  }
})();

_fragment = function(html) {
  var f, temp;
  temp = document.createElement('div');
  temp.innerHTML = html;
  f = document.createDocumentFragment();
  while (temp.firstChild) {
    f.appendChild(temp.firstChild);
  }
  return f;
};

pi.Nod = (function(_super) {
  __extends(Nod, _super);

  function Nod(node) {
    this.node = node;
    Nod.__super__.constructor.apply(this, arguments);
    if (this.node == null) {
      throw Error("Node is undefined!");
    }
    this._disposed = false;
    this._data = _dataset(node);
    if (this.node._nod == null) {
      this.node._nod = this;
    }
  }

  Nod.create = function(node) {
    switch (false) {
      case !!node:
        return null;
      case !(node instanceof this):
        return node;
      case !(typeof node["_nod"] !== "undefined"):
        return node._nod;
      case !utils.is_html(node):
        return this._create_html(node);
      case typeof node !== "string":
        return new this(document.createElement(node));
      default:
        return new this(node);
    }
  };

  Nod._create_html = function(html) {
    var node, temp;
    temp = document.createElement('div');
    temp.innerHTML = html;
    node = temp.firstChild;
    temp.removeChild(node);
    return new this(node);
  };

  Nod.prototype.find = function(selector) {
    return pi.Nod.create(this.node.querySelector(selector));
  };

  Nod.prototype.all = function(selector) {
    return this.node.querySelectorAll(selector);
  };

  Nod.prototype.each = function(selector, callback) {
    var i, node, _i, _len, _ref, _results;
    i = 0;
    _ref = this.node.querySelectorAll(selector);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (callback.call(null, node, i) === true) {
        break;
      }
      _results.push(i++);
    }
    return _results;
  };

  Nod.prototype.first = function(selector) {
    return this.find(selector);
  };

  Nod.prototype.last = function(selector) {
    return this.find("" + selector + ":last-child");
  };

  Nod.prototype.nth = function(selector, n) {
    return this.find("" + selector + ":nth-child(" + n + ")");
  };

  Nod.prototype.find_bf = function(selector) {
    var acc, el, nod, rest;
    rest = [];
    acc = [];
    el = this.node.firstChild;
    while (el) {
      if (el.nodeType !== 1) {
        el = el.nextSibling || rest.shift();
        continue;
      }
      if (el.matches(selector)) {
        acc.push(el);
        nod = el.querySelector(selector);
        if (nod != null) {
          rest.push(nod);
        }
      } else {
        if ((nod = el.querySelector(selector))) {
          el.nextSibling && rest.unshift(el.nextSibling);
          el = nod;
          continue;
        }
      }
      el = el.nextSibling || rest.shift();
    }
    return acc;
  };

  Nod.prototype.attrs = function(data) {
    var name, val;
    for (name in data) {
      if (!__hasProp.call(data, name)) continue;
      val = data[name];
      this.attr(name, val);
    }
    return this;
  };

  Nod.prototype.styles = function(data) {
    var name, val;
    for (name in data) {
      if (!__hasProp.call(data, name)) continue;
      val = data[name];
      this.style(name, val);
    }
    return this;
  };

  Nod.prototype.parent = function(selector) {
    var p;
    if (selector == null) {
      if (this.node.parentNode != null) {
        return pi.Nod.create(this.node.parentNode);
      } else {
        return null;
      }
    } else {
      p = this.node;
      while ((p = p.parentNode) && (p !== document)) {
        if (p.matches(selector)) {
          return pi.Nod.create(p);
        }
      }
      return null;
    }
  };

  Nod.prototype.children = function(selector) {
    var n, _i, _len, _ref, _results;
    if (selector != null) {
      _ref = this.node.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (n.matches(selector)) {
          _results.push(n);
        }
      }
      return _results;
    } else {
      return this.node.children;
    }
  };

  Nod.prototype.wrap = function() {
    var klasses, wrapper;
    klasses = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    wrapper = pi.Nod.create('div');
    wrapper.addClass.apply(wrapper, klasses);
    this.node.parentNode.insertBefore(wrapper.node, this.node);
    return wrapper.append(this.node);
  };

  Nod.prototype.prepend = function(node) {
    node = _node(node);
    this.node.insertBefore(node, this.node.firstChild);
    return this;
  };

  Nod.prototype.append = function(node) {
    node = _node(node);
    this.node.appendChild(node);
    return this;
  };

  Nod.prototype.insertBefore = function(node) {
    node = _node(node);
    this.node.parentNode.insertBefore(node, this.node);
    return this;
  };

  Nod.prototype.insertAfter = function(node) {
    node = _node(node);
    this.node.parentNode.insertBefore(node, this.node.nextSibling);
    return this;
  };

  Nod.prototype.detach = function() {
    this.node.parentNode.removeChild(this.node);
    return this;
  };

  Nod.prototype.detach_children = function() {
    while (this.node.children.length) {
      this.node.removeChild(this.node.children[0]);
    }
    return this;
  };

  Nod.prototype.remove = function() {
    this.detach();
    this.html('');
    this.dispose();
    return null;
  };

  Nod.prototype.empty = function() {
    this.html('');
    return this;
  };

  Nod.prototype.clone = function() {
    var c, nod;
    c = document.createElement(this.node.nameNode);
    c.innerHTML = this.node.outerHTML;
    nod = new pi.Nod(c.firstChild);
    return utils.extend(nod, this, true, ['listeners', 'listeners_by_type', '__components__', 'native_event_listener', 'node']);
  };

  Nod.prototype.dispose = function() {
    var key, val;
    if (this._disposed) {
      return;
    }
    this.off();
    delete this.node._nod;
    for (key in this) {
      if (!__hasProp.call(this, key)) continue;
      val = this[key];
      delete this[key];
    }
    this._disposed = true;
  };

  Nod.prototype.html = function(val) {
    if (val != null) {
      this.node.innerHTML = val;
      return this;
    } else {
      return this.node.innerHTML;
    }
  };

  Nod.prototype.outerHTML = function(val) {
    if (val != null) {
      this.node.outerHTML = val;
      return this;
    } else {
      return this.node.outerHTML;
    }
  };

  Nod.prototype.text = function(val) {
    if (val != null) {
      this.node.textContent = val;
      return this;
    } else {
      return this.node.textContent;
    }
  };

  Nod.prototype.value = function(val) {
    if (val != null) {
      this.node.value = val;
      return this;
    } else {
      return this.node.value;
    }
  };

  Nod.prototype.addClass = function() {
    var c, _i, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      c = arguments[_i];
      this.node.classList.add(c);
    }
    return this;
  };

  Nod.prototype.removeClass = function() {
    var c, _i, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      c = arguments[_i];
      this.node.classList.remove(c);
    }
    return this;
  };

  Nod.prototype.toggleClass = function(c) {
    this.node.classList.toggle(c);
    return this;
  };

  Nod.prototype.hasClass = function(c) {
    return this.node.classList.contains(c);
  };

  Nod.prototype.mergeClasses = function(nod) {
    var klass, _i, _len, _ref;
    _ref = nod.node.className.split(/\s+/);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      klass = _ref[_i];
      this.addClass(klass);
    }
    return this;
  };

  Nod.prototype.x = function() {
    var node, offset;
    offset = this.node.offsetLeft;
    node = this.node;
    while ((node = node.offsetParent)) {
      offset += node.offsetLeft;
    }
    return offset;
  };

  Nod.prototype.y = function() {
    var node, offset;
    offset = this.node.offsetTop;
    node = this.node;
    while ((node = node.offsetParent)) {
      offset += node.offsetTop;
    }
    return offset;
  };

  Nod.prototype.move = function(x, y) {
    return this.style({
      left: "" + x + "px",
      top: "" + y + "px"
    });
  };

  Nod.prototype.position = function() {
    return {
      x: this.x(),
      y: this.y()
    };
  };

  Nod.prototype.offset = function() {
    return {
      x: this.node.offsetLeft,
      y: this.node.offsetTop
    };
  };

  Nod.prototype.size = function(width, height) {
    var old_h, old_w;
    if (width == null) {
      width = null;
    }
    if (height == null) {
      height = null;
    }
    if (!((width != null) && (height != null))) {
      return {
        width: this.width(),
        height: this.height()
      };
    }
    if ((width != null) && (height != null)) {
      this.width(width);
      this.height(height);
    } else {
      old_h = this.height();
      old_w = this.width();
      if (width != null) {
        this.width(width);
        this.height(old_h * width / old_w);
      } else {
        this.height(height);
        this.width(old_w * height / old_h);
      }
    }
    this.trigger('resize');
  };

  Nod.prototype.show = function() {
    return this.node.style.display = "block";
  };

  Nod.prototype.hide = function() {
    return this.node.style.display = "none";
  };

  Nod.prototype.focus = function() {
    this.node.focus();
    return this;
  };

  Nod.prototype.blur = function() {
    this.node.blur();
    return this;
  };

  return Nod;

})(pi.NodEventDispatcher);

_prop_hash("data", function(prop, val) {
  if (prop === void 0) {
    return this._data;
  }
  prop = prop.replace("-", "_");
  if (val === null) {
    val = this._data[prop];
    delete this._data[prop];
    return val;
  }
  if (val === void 0) {
    return this._data[prop];
  } else {
    this._data[prop] = val;
    return this;
  }
});

_prop_hash("style", function(prop, val) {
  if (val === void 0) {
    return this.node.style[prop];
  }
  return this.node.style[prop] = val;
});

_prop_hash("attr", function(prop, val) {
  if (val === null) {
    return this.node.removeAttribute(prop);
  } else if (val === void 0) {
    return this.node.getAttribute(prop);
  } else {
    return this.node.setAttribute(prop, val);
  }
});

_geometry_styles(["top", "left", "width", "height"]);

_ref = ["top", "left", "width", "height"];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  d = _ref[_i];
  prop = "scroll" + (utils.capitalize(d));
  pi.Nod.prototype[prop] = function() {
    return this.node[prop];
  };
}

pi.NodRoot = (function(_super) {
  __extends(NodRoot, _super);

  NodRoot.instance = null;

  function NodRoot() {
    if (pi.NodRoot.instance) {
      throw "NodRoot is already defined!";
    }
    pi.NodRoot.instance = this;
    NodRoot.__super__.constructor.call(this, document.documentElement);
  }

  NodRoot.prototype.initialize = function() {
    var load_handler, ready_handler, _ready_state;
    _ready_state = document.attachEvent ? 'complete' : 'interactive';
    this._loaded = document.readyState === 'complete';
    if (!this._loaded) {
      this._loaded_callbacks = [];
      load_handler = (function(_this) {
        return function() {
          utils.debug('DOM loaded');
          _this._loaded = true;
          _this.fire_all();
          return pi.NodEvent.remove(window, 'load', load_handler);
        };
      })(this);
      pi.NodEvent.add(window, 'load', load_handler);
    }
    if (!this._ready) {
      if (document.addEventListener) {
        this._ready = document.readyState === _ready_state;
        if (this._ready) {
          return;
        }
        this._ready_callbacks = [];
        ready_handler = (function(_this) {
          return function() {
            utils.debug('DOM ready');
            _this._ready = true;
            _this.fire_ready();
            return document.removeEventListener('DOMContentLoaded', ready_handler);
          };
        })(this);
        return document.addEventListener('DOMContentLoaded', ready_handler);
      } else {
        this._ready = document.readyState === _ready_state;
        if (this._ready) {
          return;
        }
        this._ready_callbacks = [];
        ready_handler = (function(_this) {
          return function() {
            if (document.readyState === _ready_state) {
              utils.debug('DOM ready');
              _this._ready = true;
              _this.fire_ready();
              return document.detachEvent('onreadystatechange', ready_handler);
            }
          };
        })(this);
        return document.attachEvent('onreadystatechange', ready_handler);
      }
    }
  };

  NodRoot.prototype.ready = function(callback) {
    if (this._ready) {
      return callback.call(null);
    } else {
      return this._ready_callbacks.push(callback);
    }
  };

  NodRoot.prototype.loaded = function(callback) {
    if (this._loaded) {
      return callback.call(null);
    } else {
      return this._loaded_callbacks.push(callback);
    }
  };

  NodRoot.prototype.fire_all = function() {
    var callback;
    if (this._ready_callbacks) {
      this.fire_ready();
    }
    while (callback = this._loaded_callbacks.shift()) {
      callback.call(null);
    }
    return this._loaded_callbacks = null;
  };

  NodRoot.prototype.fire_ready = function() {
    var callback;
    while (callback = this._ready_callbacks.shift()) {
      callback.call(null);
    }
    return this._ready_callbacks = null;
  };

  NodRoot.prototype.scrollTop = function() {
    return this.node.scrollTop || document.body.scrollTop;
  };

  NodRoot.prototype.scrollLeft = function() {
    return this.node.scrollLeft || document.body.scrollLeft;
  };

  NodRoot.prototype.scrollHeight = function() {
    return this.node.scrollHeight;
  };

  NodRoot.prototype.scrollWidth = function() {
    return this.node.scrollWidth;
  };

  NodRoot.prototype.height = function() {
    return window.innerHeight || this.node.clientHeight;
  };

  NodRoot.prototype.width = function() {
    return window.innerWidth || this.node.clientWidth;
  };

  return NodRoot;

})(pi.Nod);

pi.Nod.root = new pi.NodRoot();

pi.Nod.win = new pi.Nod(window);

pi.Nod.body = new pi.Nod(document.body);

pi.$ = function(q) {
  if (utils.is_html(q)) {
    return pi.Nod.create(q);
  } else {
    return pi.Nod.root.find(q);
  }
};

pi["export"](pi.$, '$');

if (window.window.bowser != null) {
  klasses = [];
  if (window.bowser.msie) {
    klasses.push('ie', "ie" + (window.bowser.version | 0));
  }
  if (window.bowser.mobile) {
    klasses.push('mobile');
  }
  if (window.bowser.tablet) {
    klasses.push('tablet');
  }
  if (klasses.length) {
    pi.Nod.root.addClass.apply(pi.Nod.root, klasses);
  }
}

pi.Nod.root.initialize();



},{"./events":31,"./pi":35,"./utils":38}],35:[function(require,module,exports){
'use strict';
var pi;

pi = {};

module.exports = {};



},{}],36:[function(require,module,exports){
'use strict';
var pi, _conflicts,
  __hasProp = {}.hasOwnProperty,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

pi = require('../pi');

_conflicts = {};

pi["export"] = function(fun, as) {
  if (window[as] != null) {
    if (_conflicts[as] == null) {
      _conflicts[as] = window[as];
    }
  }
  return window[as] = fun;
};

pi.noconflict = function() {
  var fun, name, _results;
  _results = [];
  for (name in _conflicts) {
    if (!__hasProp.call(_conflicts, name)) continue;
    fun = _conflicts[name];
    _results.push(window[name] = fun);
  }
  return _results;
};

pi.utils = (function() {
  function utils() {}

  utils.uniq_id = 100;

  utils.email_rxp = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;

  utils.html_rxp = /^\s*<.+>\s*$/m;

  utils.esc_rxp = /[-[\]{}()*+?.,\\^$|#]/g;

  utils.clickable_rxp = /^(a|button|input|textarea)$/i;

  utils.trim_rxp = /^\s*(.*[^\s])\s*$/m;

  utils.notsnake_rxp = /((?:^[^A-Z]|[A-Z])[^A-Z]*)/g;

  utils.uid = function() {
    return "" + (++this.uniq_id);
  };

  utils.escapeRegexp = function(str) {
    return str.replace(this.esc_rxp, "\\$&");
  };

  utils.trim = function(str) {
    return str.replace(this.trim_rxp, "$1");
  };

  utils.is_email = function(str) {
    return this.email_rxp.test(str);
  };

  utils.is_html = function(str) {
    return this.html_rxp.test(str);
  };

  utils.clickable = function(node) {
    return this.clickable_rxp.test(node.nodeName);
  };

  utils.camelCase = function(string) {
    var word;
    string = string + "";
    if (string.length) {
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = string.split('_');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          word = _ref[_i];
          _results.push(this.capitalize(word));
        }
        return _results;
      }).call(this)).join('');
    } else {
      return string;
    }
  };

  utils.snake_case = function(string) {
    var matches, word;
    string = string + "";
    if (string.length) {
      matches = string.match(this.notsnake_rxp);
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          word = matches[_i];
          _results.push(word.toLowerCase());
        }
        return _results;
      })()).join('_');
    } else {
      return string;
    }
  };

  utils.capitalize = function(word) {
    return word[0].toUpperCase() + word.slice(1);
  };

  utils.serialize = function(val) {
    return val = (function() {
      switch (false) {
        case !(val == null):
          return null;
        case val !== 'null':
          return null;
        case val !== 'undefined':
          return void 0;
        case val !== 'true':
          return true;
        case val !== 'false':
          return false;
        case !isNaN(Number(val)):
          return val;
        default:
          return Number(val);
      }
    })();
  };

  utils.key_compare = function(a, b, key, order) {
    var reverse;
    reverse = order === 'asc';
    a = this.serialize(a[key]);
    b = this.serialize(b[key]);
    if (a === b) {
      return 0;
    }
    if (!a || a < b) {
      return 1 + (-2 * reverse);
    } else {
      return -(1 + (-2 * reverse));
    }
  };

  utils.keys_compare = function(a, b, params) {
    var key, order, param, r, _fn, _i, _len;
    r = 0;
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      _fn = (function(_this) {
        return function(key, order) {
          var r_;
          r_ = _this.key_compare(a, b, key, order);
          if (r === 0) {
            return r = r_;
          }
        };
      })(this);
      for (key in param) {
        if (!__hasProp.call(param, key)) continue;
        order = param[key];
        _fn(key, order);
      }
    }
    return r;
  };

  utils.sort = function(arr, sort_params) {
    return arr.sort(this.curry(this.keys_compare, [sort_params], this, true));
  };

  utils.sort_by = function(arr, key, order) {
    if (order == null) {
      order = 'asc';
    }
    return arr.sort(this.curry(this.key_compare, [key, order], this, true));
  };

  utils.get_path = function(obj, path) {
    var key, parts, res;
    parts = path.split(".");
    res = obj;
    while (parts.length) {
      key = parts.shift();
      if (res[key] != null) {
        res = res[key];
      } else {
        return null;
      }
    }
    return res;
  };

  utils.get_class_path = function(pckg, path) {
    path = path.split('.').map((function(_this) {
      return function(p) {
        return _this.camelCase(p);
      };
    })(this)).join('.');
    return this.get_path(pckg, path);
  };

  utils.clone = function(obj, except) {
    var flags, key, newInstance;
    if (except == null) {
      except = [];
    }
    if ((obj == null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    if (obj instanceof Element) {
      return obj.cloneNode(true);
    }
    if (typeof obj.clone === 'function') {
      return obj.clone();
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      if ((__indexOf.call(except, key) < 0)) {
        newInstance[key] = this.clone(obj[key]);
      }
    }
    return newInstance;
  };

  utils.merge = function(to, from) {
    var key, obj, prop;
    obj = this.clone(to);
    for (key in from) {
      if (!__hasProp.call(from, key)) continue;
      prop = from[key];
      obj[key] = prop;
    }
    return obj;
  };

  utils.extend = function(target, data, overwrite, except) {
    var key, prop;
    if (overwrite == null) {
      overwrite = false;
    }
    if (except == null) {
      except = [];
    }
    for (key in data) {
      if (!__hasProp.call(data, key)) continue;
      prop = data[key];
      if (((target[key] == null) || overwrite) && !(__indexOf.call(except, key) >= 0)) {
        target[key] = prop;
      }
    }
    return target;
  };

  utils.uniq = function(arr) {
    var el, res, _i, _len;
    res = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      el = arr[_i];
      if ((__indexOf.call(res, el) < 0)) {
        res.push(el);
      }
    }
    return res;
  };

  utils.to_a = function(obj) {
    if (Array.isArray(obj)) {
      return obj;
    } else {
      return [obj];
    }
  };

  utils.debounce = function(period, fun, ths) {
    var _buf, _wait;
    _wait = false;
    _buf = null;
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (_wait) {
        _buf = args;
        return;
      }
      pi.utils.after(period, function() {
        _wait = false;
        if (_buf != null) {
          return fun.apply(ths, _buf);
        }
      });
      _wait = true;
      if (_buf == null) {
        return fun.apply(ths, args);
      }
    };
  };

  utils.curry = function(fun, args, ths, last) {
    if (args == null) {
      args = [];
    }
    if (last == null) {
      last = false;
    }
    fun = "function" === typeof fun ? fun : ths[fun];
    args = args instanceof Array ? args : [args];
    return function() {
      var rest;
      rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return fun.apply(ths || this, last ? rest.concat(args) : args.concat(rest));
    };
  };

  utils.delayed = function(delay, fun, args, ths) {
    if (args == null) {
      args = [];
    }
    return function() {
      return setTimeout(pi.utils.curry(fun, args, ths), delay);
    };
  };

  utils.after = function(delay, fun, ths) {
    return pi.utils.delayed(delay, fun, [], ths)();
  };

  return utils;

})();

pi["export"](pi.utils.curry, 'curry');

pi["export"](pi.utils.delayed, 'delayed');

pi["export"](pi.utils.after, 'after');

pi["export"](pi.utils.debounce, 'debounce');



},{"../pi":35}],37:[function(require,module,exports){
'use strict';
var History;

History = (function() {
  function History() {
    this._storage = [];
    this._position = 0;
  }

  History.prototype.push = function(item) {
    if (this._position < 0) {
      this._storage.splice(this._storage.length + this._position - 1, -this._position);
      this._position = 0;
    }
    return this._storage.push(item);
  };

  History.prototype.pop = function() {
    this._position -= 1;
    return this._storage[this._storage.length + this._position];
  };

  History.prototype.size = function() {
    return this._storage.length;
  };

  History.prototype.clear = function() {
    this._storage.length = 0;
    return this._position = 0;
  };

  return History;

})();

module.exports = History;



},{}],38:[function(require,module,exports){
'use strict';
require('./base');

require('./time');

require('./logger');



},{"./base":36,"./logger":39,"./time":40}],39:[function(require,module,exports){
'use strict';
var level, pi, utils, val, _log_levels, _show_log,
  __slice = [].slice;

pi = require('../pi');

require('./base');

require('./time');

utils = pi.utils;

if (!window.console || !window.console.log) {
  window.console = {
    log: function() {
      return true;
    }
  };
}

pi.log_level || (pi.log_level = "info");

_log_levels = {
  error: {
    color: "#dd0011",
    sort: 4
  },
  debug: {
    color: "#009922",
    sort: 0
  },
  info: {
    color: "#1122ff",
    sort: 1
  },
  warning: {
    color: "#ffaa33",
    sort: 2
  }
};

_show_log = function(level) {
  return _log_levels[pi.log_level].sort <= _log_levels[level].sort;
};

utils.log = function() {
  var level, messages;
  level = arguments[0], messages = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return _show_log(level) && console.log("%c " + (utils.time.now('%H:%M:%S:%L')) + " [" + level + "]", "color: " + _log_levels[level].color, messages);
};

for (level in _log_levels) {
  val = _log_levels[level];
  utils[level] = utils.curry(utils.log, level);
}



},{"../pi":35,"./base":36,"./time":40}],40:[function(require,module,exports){
'use strict';
var pi, utils, _formatter, _pad, _reg, _splitter;

pi = require('../pi');

require('./base');

utils = pi.utils;

_reg = /%([a-zA-Z])/g;

_splitter = (function() {
  if ("%a".split(_reg).length === 0) {
    return function(str) {
      var flag, len, matches, parts, res;
      matches = str.match(_reg);
      parts = str.split(_reg);
      res = [];
      if (str[0] === "%") {
        res.push("", matches.shift()[1]);
      }
      len = matches.length + parts.length;
      flag = false;
      while (len > 0) {
        res.push(flag ? matches.shift()[1] : parts.shift());
        flag = !flag;
        len--;
      }
      return res;
    };
  } else {
    return function(str) {
      return str.split(_reg);
    };
  }
})();

_pad = function(val, offset) {
  var n;
  if (offset == null) {
    offset = 1;
  }
  n = 10;
  while (offset) {
    if (val < n) {
      val = "0" + val;
    }
    n *= 10;
    offset--;
  }
  return val;
};

_formatter = {
  "H": function(d) {
    return _pad(d.getHours());
  },
  "k": function(d) {
    return d.getHours();
  },
  "I": function(d) {
    return _pad(_formatter.l(d));
  },
  "l": function(d) {
    var h;
    h = d.getHours();
    if (h > 12) {
      return h - 12;
    } else {
      return h;
    }
  },
  "M": function(d) {
    return _pad(d.getMinutes());
  },
  "S": function(d) {
    return _pad(d.getSeconds());
  },
  "L": function(d) {
    return _pad(d.getMilliseconds(), 2);
  },
  "z": function(d) {
    var offset, sign;
    offset = d.getTimezoneOffset();
    sign = offset > 0 ? "-" : "+";
    offset = Math.abs(offset);
    return sign + _pad(Math.floor(offset / 60)) + ":" + _pad(offset % 60);
  },
  "Y": function(d) {
    return d.getFullYear();
  },
  "y": function(d) {
    return (d.getFullYear() + "").slice(2);
  },
  "m": function(d) {
    return _pad(d.getMonth() + 1);
  },
  "d": function(d) {
    return _pad(d.getDate());
  },
  "P": function(d) {
    if (d.getHours() > 11) {
      return "PM";
    } else {
      return "AM";
    }
  },
  "p": function(d) {
    return _formatter.P(d).toLowerCase();
  }
};

utils.time = {
  now: function(fmt) {
    return this.format(new Date(), fmt);
  },
  format: function(t, fmt) {
    var flag, fmt_arr, i, res, _i, _len;
    if (fmt == null) {
      return t;
    }
    fmt_arr = _splitter(fmt);
    flag = false;
    res = "";
    for (_i = 0, _len = fmt_arr.length; _i < _len; _i++) {
      i = fmt_arr[_i];
      res += (flag ? _formatter[i].call(null, t) : i);
      flag = !flag;
    }
    return res;
  }
};



},{"../pi":35,"./base":36}],41:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../core');

require('./net');

utils = pi.utils;

pi.net.IframeUpload = (function() {
  function IframeUpload() {}

  IframeUpload._build_iframe = function(id) {
    var iframe;
    iframe = pi.Nod.create('iframe');
    iframe.attrs({
      id: id,
      name: id,
      width: 0,
      height: 0,
      border: 0
    });
    iframe.styles({
      width: 0,
      height: 0,
      border: 'none'
    });
    return iframe;
  };

  IframeUpload._build_input = function(name, value) {
    var input;
    input = pi.Nod.create('input');
    input.node.type = 'hidden';
    input.node.name = name;
    input.node.value = value;
    return input;
  };

  IframeUpload._build_form = function(form, iframe, params, url, method) {
    var param, _i, _len;
    form.attrs({
      target: iframe,
      action: url,
      method: method,
      enctype: "multipart/form-data",
      encoding: "multipart/form-data"
    });
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      form.append(this._build_input(param.name, param.value));
    }
    form.append(this._build_input('__iframe__', iframe));
    return form;
  };

  IframeUpload.upload = function(form, url, params, method) {
    return new Promise((function(_this) {
      return function(resolve) {
        var iframe, iframe_id;
        iframe_id = "iframe_" + (utils.uid());
        iframe = _this._build_iframe(iframe_id);
        form = _this._build_form(form, iframe_id, params, url, method);
        pi.Nod.body.append(iframe);
        iframe.on("load", function() {
          var response;
          if (iframe.node.contentDocument.readyState === 'complete') {
            response = iframe.node.contentDocument.getElementsByTagName("body")[0];
            utils.after(500, function() {
              return iframe.remove();
            });
            iframe.off();
            return resolve(response);
          }
        });
        return form.node.submit();
      };
    })(this));
  };

  return IframeUpload;

})();



},{"../core":33,"./net":43}],42:[function(require,module,exports){
'use strict';
require('./net');

require('./iframe.upload');



},{"./iframe.upload":41,"./net":43}],43:[function(require,module,exports){
'use strict';
var method, pi, utils, _i, _len, _ref,
  __hasProp = {}.hasOwnProperty;

pi = require('../core');

utils = pi.utils;

pi.Net = (function() {
  function Net() {}

  Net._prepare_response = function(xhr) {
    var response, type;
    type = xhr.getResponseHeader('Content-Type');
    response = /json/.test(type) ? JSON.parse(xhr.responseText) : xhr.responseText;
    utils.debug('XHR response', xhr.responseText);
    return response;
  };

  Net._is_success = function(status) {
    return (status >= 200 && status < 300) || (status === 304);
  };

  Net._with_prefix = function(prefix, key) {
    if (prefix) {
      return "" + prefix + "[" + key + "]";
    } else {
      return key;
    }
  };

  Net._to_params = function(data, prefix) {
    var item, key, params, val, _i, _len;
    if (prefix == null) {
      prefix = "";
    }
    params = [];
    if (data == null) {
      return params;
    }
    if (typeof data !== 'object') {
      params.push({
        name: prefix,
        value: data
      });
    } else {
      if (data instanceof Date) {
        params.push({
          name: prefix,
          value: data.getTime()
        });
      } else if (data instanceof Array) {
        prefix += "[]";
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          params = params.concat(this._to_params(item, prefix));
        }
      } else if (!!window.File && ((data instanceof File) || (data instanceof Blob))) {
        params.push({
          name: prefix,
          value: data
        });
      } else {
        for (key in data) {
          if (!__hasProp.call(data, key)) continue;
          val = data[key];
          params = params.concat(this._to_params(val, this._with_prefix(prefix, key)));
        }
      }
    }
    return params;
  };

  Net._data_to_query = function(data) {
    var param, q, _i, _len, _ref;
    q = [];
    _ref = this._to_params(data);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      param = _ref[_i];
      q.push("" + param.name + "=" + (encodeURIComponent(param.value)));
    }
    return q.join("&");
  };

  Net._data_to_form = (!!window.FormData ? function(data) {
    var form, param, _i, _len, _ref;
    form = new FormData();
    _ref = Net._to_params(data);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      param = _ref[_i];
      form.append(param.name, param.value);
    }
    return form;
  } : function(data) {
    return Net._data_to_query(data);
  });

  Net.use_json = true;

  Net.headers = [];

  Net.request = function(method, url, data, options, xhr) {
    if (options == null) {
      options = {};
    }
    return new Promise((function(_this) {
      return function(resolve, reject, progress) {
        var key, q, req, use_json, value, _headers;
        req = xhr || new XMLHttpRequest();
        use_json = options.json != null ? options.json : _this.use_json;
        _headers = utils.merge(pi.net.headers, options.headers || {});
        if (method === 'GET') {
          q = _this._data_to_query(data);
          if (q) {
            if (url.indexOf("?") < 0) {
              url += "?";
            } else {
              url += "&";
            }
            url += "" + q;
          }
          data = null;
        } else {
          if (use_json) {
            _headers['Content-Type'] = 'application/json';
            if (data != null) {
              data = JSON.stringify(data);
            }
          } else {
            data = _this._data_to_form(data);
          }
        }
        req.open(method, url, true);
        req.withCredentials = !!options.withCredentials;
        for (key in _headers) {
          if (!__hasProp.call(_headers, key)) continue;
          value = _headers[key];
          req.setRequestHeader(key, value);
        }
        _headers = null;
        if (typeof progress === 'function') {
          req.upload.onprogress = function(event) {
            value = event.lengthComputable ? event.loaded * 100 / event.total : 0;
            if (progress != null) {
              return progress(Math.round(value));
            }
          };
        }
        req.onreadystatechange = function() {
          if (req.readyState !== 4) {
            return;
          }
          if (_this._is_success(req.status)) {
            return resolve(_this._prepare_response(req));
          } else {
            return reject(Error(req.statusText));
          }
        };
        req.onerror = function() {
          reject(Error("Network Error"));
        };
        return req.send(data);
      };
    })(this));
  };

  Net.upload = function(url, data, options, xhr) {
    var method;
    if (data == null) {
      data = {};
    }
    if (options == null) {
      options = {};
    }
    if (!this.XHR_UPLOAD) {
      throw Error('File upload not supported');
    }
    method = options.method || 'POST';
    options.json = false;
    return this.request(method, url, data, options, xhr);
  };

  Net.iframe_upload = function(form, url, data, options) {
    var as_json, method;
    if (data == null) {
      data = {};
    }
    if (options == null) {
      options = {};
    }
    as_json = options.as_json != null ? options.as_json : this.use_json;
    if (!(form instanceof pi.Nod)) {
      form = pi.Nod.create(form);
    }
    if (form == null) {
      throw Error('Form is undefined');
    }
    method = options.method || 'POST';
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return pi.net.IframeUpload.upload(form, url, _this._to_params(data), method).then(function(response) {
          if (response == null) {
            reject(Error('Response is empty'));
          }
          if (!as_json) {
            resolve(response.innerHtml);
          }
          response = JSON.parse(response.innerHTML);
          return resolve(response);
        })["catch"](function(e) {
          return reject(e);
        });
      };
    })(this));
  };

  return Net;

})();

pi.Net.XHR_UPLOAD = !!window.FormData;

pi.net = pi.Net;

_ref = ['get', 'post', 'patch', 'delete'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  method = _ref[_i];
  pi.net[method] = utils.curry(pi.net.request, [method.toUpperCase()], pi.net);
}



},{"../core":33}],44:[function(require,module,exports){
'use strict'
window.pi = require('./core')
require('./components')
require('./net')
require('./resources')
require('./controllers')
require('./views')
module.exports = window.pi
},{"./components":11,"./controllers":23,"./core":33,"./net":42,"./resources":58,"./views":62}],45:[function(require,module,exports){
'use strict';
require('./selectable');



},{"./selectable":46}],46:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/pieces');

require('../plugin');

utils = pi.utils;

pi.Base.Selectable = (function(_super) {
  __extends(Selectable, _super);

  function Selectable() {
    return Selectable.__super__.constructor.apply(this, arguments);
  }

  Selectable.prototype.id = 'selectable';

  Selectable.prototype.initialize = function(target) {
    this.target = target;
    Selectable.__super__.initialize.apply(this, arguments);
    this.__selected__ = this.target.hasClass('is-selected');
    this.target.on('click', this.click_handler());
  };

  Selectable.prototype.click_handler = function() {
    return this._click_handler || (this._click_handler = (function(_this) {
      return function(e) {
        if (!_this.target.enabled) {
          return;
        }
        return _this.toggle_select();
      };
    })(this));
  };

  Selectable.prototype.toggle_select = function() {
    if (this.__selected__) {
      return this.deselect();
    } else {
      return this.select();
    }
  };

  Selectable.prototype.select = function() {
    if (!this.__selected__) {
      this.__selected__ = true;
      this.target.addClass('is-selected');
      this.target.trigger('selected', true);
    }
    return this;
  };

  Selectable.prototype.deselect = function() {
    if (this.__selected__) {
      this.__selected__ = false;
      this.target.removeClass('is-selected');
      this.target.trigger('selected', false);
    }
    return this;
  };

  return Selectable;

})(pi.Plugin);



},{"../../components/pieces":12,"../../core":33,"../plugin":56}],47:[function(require,module,exports){
'use strict';
require('./plugin');

require('./base');

require('./list');



},{"./base":45,"./list":49,"./plugin":56}],48:[function(require,module,exports){
'use strict';
var pi, utils, _is_continuation, _key_operand, _matcher, _operands,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

utils = pi.utils;

_operands = {
  "?": function(values) {
    return function(value) {
      return __indexOf.call(values, value) >= 0;
    };
  },
  "?&": function(values) {
    return function(value) {
      var v, _i, _len;
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        v = values[_i];
        if (!(__indexOf.call(value, v) >= 0)) {
          return false;
        }
      }
      return true;
    };
  },
  ">": function(val) {
    return function(value) {
      return value >= val;
    };
  },
  "<": function(val) {
    return function(value) {
      return value <= val;
    };
  }
};

_key_operand = /^([\w\d_]+)(\?&|>|<|\?)$/;

_matcher = function(params) {
  var key, matches, obj, val;
  obj = {};
  for (key in params) {
    if (!__hasProp.call(params, key)) continue;
    val = params[key];
    if (typeof val === 'object' && !(Array.isArray(val))) {
      obj[key] = _matcher(val);
    } else {
      if ((matches = key.match(_key_operand))) {
        obj[matches[1]] = _operands[matches[2]](val);
      } else {
        obj[key] = val;
      }
    }
  }
  return pi.List.object_matcher(obj);
};

_is_continuation = function(prev, params) {
  var key, val;
  for (key in prev) {
    if (!__hasProp.call(prev, key)) continue;
    val = prev[key];
    if (params[key] !== val) {
      return false;
    }
  }
  return true;
};

pi.List.Filterable = (function(_super) {
  __extends(Filterable, _super);

  function Filterable() {
    return Filterable.__super__.constructor.apply(this, arguments);
  }

  Filterable.prototype.id = 'filterable';

  Filterable.prototype.initialize = function(list) {
    this.list = list;
    Filterable.__super__.initialize.apply(this, arguments);
    this.list.delegate_to(this, 'filter');
    return this.list.on('update', (function(e) {
      if (e.data.type === 'item_added' && this.filtered) {
        this._all_items.push(e.data.item);
      }
      return this.filter(this._prevf);
    }), this, (function(_this) {
      return function(e) {
        return e.data.type === 'item_added' || e.data.type === 'item_updated';
      };
    })(this));
  };

  Filterable.prototype.all_items = function() {
    return this._all_items.filter(function(item) {
      return !item._disposed;
    });
  };

  Filterable.prototype.start_filter = function() {
    if (this.filtered) {
      return;
    }
    this.filtered = true;
    this.list.addClass('is-filtered');
    this._all_items = this.list.items.slice();
    this._prevf = {};
    return this.list.trigger('filter_start');
  };

  Filterable.prototype.stop_filter = function(rollback) {
    if (rollback == null) {
      rollback = true;
    }
    if (!this.filtered) {
      return;
    }
    this.filtered = false;
    this.list.removeClass('is-filtered');
    if (rollback) {
      this.list.data_provider(this.all_items());
    }
    this._all_items = null;
    return this.list.trigger('filter_stop');
  };

  Filterable.prototype.filter = function(params) {
    var item, matcher, scope, _buffer;
    if (params == null) {
      return this.stop_filter();
    }
    if (!this.filtered) {
      this.start_filter();
    }
    scope = _is_continuation(this._prevf, params) ? this.list.items.slice() : this.all_items();
    this._prevf = params;
    matcher = _matcher({
      record: params
    });
    _buffer = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = scope.length; _i < _len; _i++) {
        item = scope[_i];
        if (matcher(item)) {
          _results.push(item);
        }
      }
      return _results;
    })();
    this.list.data_provider(_buffer);
    return this.list.trigger('filter_update');
  };

  return Filterable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56}],49:[function(require,module,exports){
'use strict';
require('./selectable');

require('./sortable');

require('./searchable');

require('./filterable');

require('./scrollend');

require('./move_select');

require('./nested_select');



},{"./filterable":48,"./move_select":50,"./nested_select":51,"./scrollend":52,"./searchable":53,"./selectable":54,"./sortable":55}],50:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

require('./selectable');

utils = pi.utils;

pi.List.MoveSelect = (function(_super) {
  __extends(MoveSelect, _super);

  function MoveSelect() {
    return MoveSelect.__super__.constructor.apply(this, arguments);
  }

  MoveSelect.prototype.id = 'move_select';

  MoveSelect.prototype.initialize = function(list) {
    this.list = list;
    MoveSelect.__super__.initialize.apply(this, arguments);
    if (!this.list.has_selectable) {
      this.list.attach_plugin(pi.List.Selectable);
    }
    this._direction = this.list.options.direction || 'y';
    return this.list.on('mousedown', this.mouse_down_listener());
  };

  MoveSelect.prototype._item_under_point = function(point) {
    return this._item_bisearch(0, point[this._direction], point);
  };

  MoveSelect.prototype._item_bisearch = function(start, delta, point) {
    var index, index_shift, item, match;
    index_shift = ((delta / this._height) * this._len) | 0;
    if (index_shift === 0) {
      index_shift = delta > 0 ? 1 : -1;
    }
    index = start + index_shift;
    if (index < 0) {
      return 0;
    }
    if (index > this._len - 1) {
      return this._len - 1;
    }
    item = this.list.items[index];
    match = this._item_match_point(item, point);
    if (match === 0) {
      return index;
    } else {
      return this._item_bisearch(index, match, point);
    }
  };

  MoveSelect.prototype._item_match_point = function(item, point) {
    var item_x, item_y, param, pos, _ref;
    _ref = item.position(), item_x = _ref.x, item_y = _ref.y;
    pos = {
      x: item_x - this._offset.x,
      y: item_y - this._offset.y
    };
    param = this._direction === 'y' ? item.height() : item.width();
    if (point[this._direction] >= pos[this._direction] && pos[this._direction] + param > point[this._direction]) {
      return 0;
    } else {
      return point[this._direction] - pos[this._direction];
    }
  };

  MoveSelect.prototype._update_range = function(index) {
    var below, downward;
    if (index === this._last_index) {
      return;
    }
    if ((this._last_index - this._start_index) * (index - this._start_index) < 0) {
      this._update_range(this._start_index);
    }
    utils.debug("next index: " + index + "; last index: " + this._last_index + "; start: " + this._start_index);
    downward = (index - this._last_index) > 0;
    below = this._last_index !== this._start_index ? (this._last_index - this._start_index) > 0 : downward;
    utils.debug("below: " + below + "; downward: " + downward);
    switch (false) {
      case !(downward && below):
        this._select_range(this._last_index + 1, index);
        break;
      case !(!downward && !below):
        this._select_range(index, this._last_index - 1);
        break;
      case !(downward && !below):
        this._clear_range(this._last_index, index - 1);
        break;
      default:
        this._clear_range(index + 1, this._last_index);
    }
    return this._last_index = index;
  };

  MoveSelect.prototype._clear_range = function(from, to) {
    var item, _i, _len, _ref, _results;
    _ref = this.list.items.slice(from, +to + 1 || 9e9);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(this.list.deselect_item(item));
    }
    return _results;
  };

  MoveSelect.prototype._select_range = function(from, to) {
    var item, _i, _len, _ref, _results;
    _ref = this.list.items.slice(from, +to + 1 || 9e9);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(this.list.select_item(item));
    }
    return _results;
  };

  MoveSelect.prototype.mouse_down_listener = function() {
    return this._mouse_down_listener || (this._mouse_down_listener = (function(_this) {
      return function(e) {
        var _ref, _x, _y;
        _ref = _this.list.items_cont.position(), _x = _ref.x, _y = _ref.y;
        _this._offset = {
          x: _x,
          y: _y
        };
        _this._start_point = {
          x: e.pageX - _x,
          y: e.pageY - _y
        };
        _this._wait_drag = utils.after(300, function() {
          _this._height = _this.list.height();
          _this._len = _this.list.items.length;
          _this._start_index = _this._item_under_point(_this._start_point);
          _this._last_index = _this._start_index;
          _this.list.clear_selection(true);
          _this.list.select_item(_this.list.items[_this._start_index]);
          _this.list.trigger('selected');
          _this.list.on('mousemove', _this.mouse_move_listener());
          return _this._moving = true;
        });
        return pi.Nod.root.on('mouseup', _this.mouse_up_listener());
      };
    })(this));
  };

  MoveSelect.prototype.mouse_up_listener = function() {
    return this._mouse_up_listener || (this._mouse_up_listener = (function(_this) {
      return function(e) {
        pi.Nod.root.off('mouseup', _this.mouse_up_listener());
        if (_this._moving) {
          _this.list.off('mousemove', _this.mouse_move_listener());
          _this._moving = false;
          e.stopImmediatePropagation();
          return e.preventDefault();
        } else {
          return clearTimeout(_this._wait_drag);
        }
      };
    })(this));
  };

  MoveSelect.prototype.mouse_move_listener = function() {
    return this._mouse_move_listener || (this._mouse_move_listener = debounce(300, (function(_this) {
      return function(e) {
        var point;
        point = {
          x: e.pageX - _this._offset.x,
          y: e.pageY - _this._offset.y
        };
        return _this._update_range(_this._item_under_point(point));
      };
    })(this)));
  };

  return MoveSelect;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56,"./selectable":54}],51:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

require('./selectable');

utils = pi.utils;

pi.List.NestedSelect = (function(_super) {
  __extends(NestedSelect, _super);

  function NestedSelect() {
    return NestedSelect.__super__.constructor.apply(this, arguments);
  }

  NestedSelect.prototype.id = 'nested_select';

  NestedSelect.prototype.initialize = function(list) {
    this.list = list;
    NestedSelect.__super__.initialize.apply(this, arguments);
    if (!this.list.has_selectable) {
      this.list.attach_plugin(pi.List.Selectable);
    }
    this.selectable = this.list.selectable;
    this.list.delegate_to(this, 'clear_selection', 'select_all', 'selected');
    this.list.on('selection_cleared', (function(_this) {
      return function(e) {
        if (e.target !== _this.list) {
          e.cancel();
          return _this.selectable._check_selected();
        }
      };
    })(this));
  };

  NestedSelect.prototype.clear_selection = function(silent) {
    var item, _i, _len, _ref;
    if (silent == null) {
      silent = false;
    }
    this.selectable.clear_selection();
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item instanceof pi.List) {
        if (typeof item.clear_selection === "function") {
          item.clear_selection();
        }
      }
    }
    if (!silent) {
      return this.list.trigger('selection_cleared');
    }
  };

  NestedSelect.prototype.select_all = function() {
    var item, _i, _len, _ref, _selected;
    this.selectable.select_all(true);
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item instanceof pi.List) {
        if (typeof item.select_all === "function") {
          item.select_all(true);
        }
      }
    }
    _selected = this.selected();
    if (_selected.length) {
      return this.list.trigger('selected', _selected);
    }
  };

  NestedSelect.prototype.selected = function() {
    var item, _i, _len, _ref, _selected;
    _selected = [];
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.__selected__) {
        _selected.push(item);
      }
      if (item instanceof pi.List) {
        _selected = _selected.concat((typeof item.selected === "function" ? item.selected() : void 0) || []);
      }
    }
    return _selected;
  };

  return NestedSelect;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56,"./selectable":54}],52:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

utils = pi.utils;

pi.List.ScrollEnd = (function(_super) {
  __extends(ScrollEnd, _super);

  function ScrollEnd() {
    return ScrollEnd.__super__.constructor.apply(this, arguments);
  }

  ScrollEnd.prototype.id = 'scroll_end';

  ScrollEnd.prototype.initialize = function(list) {
    this.list = list;
    ScrollEnd.__super__.initialize.apply(this, arguments);
    this.scroll_object = this.list.options.scroll_object === 'window' ? pi.Nod.root : this.list.items_cont;
    this.scroll_native_listener = this.list.options.scroll_object === 'window' ? pi.Nod.win : this.list.items_cont;
    this._prev_top = this.scroll_object.scrollTop();
    if (this.list.options.scroll_end !== false) {
      this.enable();
    }
    this.list.on('update', this.scroll_listener(), this, (function(_this) {
      return function(e) {
        return e.data.type === 'item_removed' || e.data.type === 'load';
      };
    })(this));
  };

  ScrollEnd.prototype.enable = function() {
    if (this.enabled) {
      return;
    }
    this.scroll_native_listener.on('scroll', this.scroll_listener());
    return this.enabled = true;
  };

  ScrollEnd.prototype.disable = function() {
    if (!this.enabled) {
      return;
    }
    this.scroll_native_listener.off('scroll', this.scroll_listener());
    this._scroll_listener = null;
    return this.enabled = false;
  };

  ScrollEnd.prototype.scroll_listener = function() {
    if (this._scroll_listener != null) {
      return this._scroll_listener;
    }
    return this._scroll_listener = utils.debounce(500, (function(_this) {
      return function(event) {
        if (_this._prev_top <= _this.scroll_object.scrollTop() && _this.list.height() - _this.scroll_object.scrollTop() - _this.scroll_object.height() < 50) {
          _this.list.trigger('scroll_end');
        }
        return _this._prev_top = _this.scroll_object.scrollTop();
      };
    })(this));
  };

  return ScrollEnd;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56}],53:[function(require,module,exports){
'use strict';
var pi, utils, _clear_mark_regexp, _is_continuation, _selector_regexp,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

utils = pi.utils;

_clear_mark_regexp = /<mark>([^<>]*)<\/mark>/gim;

_selector_regexp = /[\.#a-z\s\[\]=\"-_,]/i;

_is_continuation = function(prev, query) {
  var _ref;
  return ((_ref = query.match(prev)) != null ? _ref.index : void 0) === 0;
};

pi.List.Searchable = (function(_super) {
  __extends(Searchable, _super);

  function Searchable() {
    return Searchable.__super__.constructor.apply(this, arguments);
  }

  Searchable.prototype.id = 'searchable';

  Searchable.prototype.initialize = function(list) {
    this.list = list;
    Searchable.__super__.initialize.apply(this, arguments);
    this.update_scope(this.list.options.search_scope);
    this.list.delegate_to(this, 'search', 'highlight');
    this.searching = false;
    this.list.on('update', (function(e) {
      if (e.data.type === 'item_added' && this.searching) {
        this._all_items.push(e.data.item);
      }
      return this.search(this._prevq);
    }), this, (function(_this) {
      return function(e) {
        return e.data.type === 'item_added' || e.data.type === 'item_updated';
      };
    })(this));
  };

  Searchable.prototype.update_scope = function(scope) {
    this.matcher_factory = this._matcher_from_scope(scope);
    if (scope && _selector_regexp.test(scope)) {
      return this._highlight_elements = function(item) {
        var selector, _i, _len, _ref, _results;
        _ref = scope.split(',');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          selector = _ref[_i];
          _results.push(item.find(selector));
        }
        return _results;
      };
    } else {
      return this._highlight_elements = function(item) {
        return [item];
      };
    }
  };

  Searchable.prototype._matcher_from_scope = function(scope) {
    return this.matcher_factory = scope == null ? pi.List.string_matcher : function(value) {
      return pi.List.string_matcher(scope + ':' + value);
    };
  };

  Searchable.prototype.all_items = function() {
    return this._all_items.filter(function(item) {
      return !item._disposed;
    });
  };

  Searchable.prototype.start_search = function() {
    if (this.searching) {
      return;
    }
    this.searching = true;
    this.list.addClass('is-searching');
    this._all_items = this.list.items.slice();
    this._prevq = '';
    return this.list.trigger('search_start');
  };

  Searchable.prototype.stop_search = function(rollback) {
    var items;
    if (rollback == null) {
      rollback = true;
    }
    if (!this.searching) {
      return;
    }
    this.searching = false;
    this.list.removeClass('is-searching');
    items = this.all_items();
    this.clear_highlight(items);
    if (rollback) {
      this.list.data_provider(items);
    }
    this._all_items = null;
    return this.list.trigger('search_stop');
  };

  Searchable.prototype.clear_highlight = function(nodes) {
    var nod, _i, _len, _raw_html, _results;
    _results = [];
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      nod = nodes[_i];
      _raw_html = nod.html();
      _raw_html = _raw_html.replace(_clear_mark_regexp, "$1");
      _results.push(nod.html(_raw_html));
    }
    return _results;
  };

  Searchable.prototype.highlight_item = function(query, item) {
    var nod, nodes, _i, _len, _raw_html, _regexp, _results;
    nodes = this._highlight_elements(item);
    _results = [];
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      nod = nodes[_i];
      if (!(nod != null)) {
        continue;
      }
      _raw_html = nod.html();
      _regexp = new RegExp("((?:^|>)[^<>]*?)(" + query + ")", "gim");
      _raw_html = _raw_html.replace(_clear_mark_regexp, "$1");
      if (query !== '') {
        _raw_html = _raw_html.replace(_regexp, '$1<mark>$2</mark>');
      }
      _results.push(nod.html(_raw_html));
    }
    return _results;
  };

  Searchable.prototype.highlight = function(q) {
    var item, _i, _len, _ref;
    this._prevq = q;
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this.highlight_item(q, item);
    }
  };

  Searchable.prototype.search = function(q, highlight) {
    var item, matcher, scope, _buffer;
    if (q == null) {
      q = '';
    }
    if (q === '') {
      return this.stop_search();
    }
    if (highlight == null) {
      highlight = this.list.options.highlight;
    }
    if (!this.searching) {
      this.start_search();
    }
    scope = _is_continuation(this._prevq, q) ? this.list.items.slice() : this.all_items();
    this._prevq = q;
    matcher = this.matcher_factory(q);
    _buffer = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = scope.length; _i < _len; _i++) {
        item = scope[_i];
        if (matcher(item)) {
          _results.push(item);
        }
      }
      return _results;
    })();
    this.list.data_provider(_buffer);
    if (highlight) {
      this.highlight(q);
    }
    return this.list.trigger('search_update');
  };

  return Searchable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56}],54:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

utils = pi.utils;

pi.List.Selectable = (function(_super) {
  __extends(Selectable, _super);

  function Selectable() {
    return Selectable.__super__.constructor.apply(this, arguments);
  }

  Selectable.prototype.id = 'selectable';

  Selectable.prototype.initialize = function(list) {
    var item, _i, _len, _ref;
    this.list = list;
    Selectable.__super__.initialize.apply(this, arguments);
    this.type(this.list.options.select_type || 'radio');
    this.list.on('item_click', this.item_click_handler());
    this.list.on('update', this.update_handler());
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.hasClass('is-selected')) {
        item.__selected__ = true;
      }
    }
    this.list.delegate_to(this, 'clear_selection', 'selected', 'selected_item', 'select_all', 'select_item', 'selected_records', 'selected_record', 'deselect_item', 'toggle_select', 'selected_size');
  };

  Selectable.prototype.type = function(value) {
    this.is_radio = !!value.match('radio');
    return this.is_check = !!value.match('check');
  };

  Selectable.prototype.item_click_handler = function() {
    return this._item_click_handler || (this._item_click_handler = (function(_this) {
      return function(e) {
        if (!e.data.item.enabled) {
          return;
        }
        if (_this.is_radio && !e.data.item.__selected__) {
          _this.clear_selection(true);
          _this.list.select_item(e.data.item);
          _this.list.trigger('selected', [e.data.item]);
        } else if (_this.is_check) {
          _this.list.toggle_select(e.data.item);
          if (_this.list.selected().length) {
            _this.list.trigger('selected', _this.selected());
          } else {
            _this.list.trigger('selection_cleared');
          }
        }
      };
    })(this));
  };

  Selectable.prototype.update_handler = function() {
    return this._update_handler || (this._update_handler = (function(_this) {
      return function(e) {
        var _ref;
        if (!((((_ref = e.data) != null ? _ref.type : void 0) != null) && e.data.type === 'item_added')) {
          return _this._check_selected();
        }
      };
    })(this));
  };

  Selectable.prototype._check_selected = function() {
    if (!this.list.selected().length) {
      return this.list.trigger('selection_cleared');
    }
  };

  Selectable.prototype.select_item = function(item) {
    if (!item.__selected__) {
      item.__selected__ = true;
      this._selected = null;
      return item.addClass('is-selected');
    }
  };

  Selectable.prototype.deselect_item = function(item) {
    if (item.__selected__) {
      item.__selected__ = false;
      this._selected = null;
      return item.removeClass('is-selected');
    }
  };

  Selectable.prototype.toggle_select = function(item) {
    if (item.__selected__) {
      return this.deselect_item(item);
    } else {
      return this.select_item(item);
    }
  };

  Selectable.prototype.clear_selection = function(silent) {
    var item, _i, _len, _ref;
    if (silent == null) {
      silent = false;
    }
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this.deselect_item(item);
    }
    if (!silent) {
      return this.list.trigger('selection_cleared');
    }
  };

  Selectable.prototype.select_all = function(silent) {
    var item, _i, _len, _ref;
    if (silent == null) {
      silent = false;
    }
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this.select_item(item);
    }
    if (this.selected().length && !silent) {
      return this.list.trigger('selected', this.selected());
    }
  };

  Selectable.prototype.selected = function() {
    if (this._selected == null) {
      this._selected = this.list.where({
        __selected__: true
      });
    }
    return this._selected;
  };

  Selectable.prototype.selected_item = function() {
    var _ref;
    _ref = this.list.selected();
    if (_ref.length) {
      return _ref[0];
    } else {
      return null;
    }
  };

  Selectable.prototype.selected_records = function() {
    return this.list.selected().map(function(item) {
      return item.record;
    });
  };

  Selectable.prototype.selected_record = function() {
    var _ref;
    _ref = this.list.selected_records();
    if (_ref.length) {
      return _ref[0];
    } else {
      return null;
    }
  };

  Selectable.prototype.selected_size = function() {
    return this.list.selected().length;
  };

  return Selectable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56}],55:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

utils = pi.utils;

pi.List.Sortable = (function(_super) {
  __extends(Sortable, _super);

  function Sortable() {
    return Sortable.__super__.constructor.apply(this, arguments);
  }

  Sortable.prototype.id = 'sortable';

  Sortable.prototype.initialize = function(list) {
    this.list = list;
    Sortable.__super__.initialize.apply(this, arguments);
    this.list.delegate_to(this, 'sort');
    return this.list.on('update', (function() {
      return this.sort(this._prevs);
    }), this, function(e) {
      return e.data.type === 'item_added' || e.data.type === 'item_updated';
    });
  };

  Sortable.prototype.sort = function(sort_params) {
    if (sort_params == null) {
      return;
    }
    sort_params = utils.to_a(sort_params);
    this._prevs = sort_params;
    this.list.items.sort(function(a, b) {
      return utils.keys_compare(a.record, b.record, sort_params);
    });
    this.list.data_provider(this.list.items.slice());
    return this.list.trigger('sort_update', sort_params);
  };

  Sortable.prototype.sorted = function(sort_params) {
    if (sort_params == null) {
      return;
    }
    sort_params = utils.to_a(sort_params);
    this._prevs = sort_params;
    return this.list.trigger('sort_update', sort_params);
  };

  return Sortable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../plugin":56}],56:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

utils = pi.utils;

pi.Plugin = (function(_super) {
  __extends(Plugin, _super);

  function Plugin() {
    return Plugin.__super__.constructor.apply(this, arguments);
  }

  Plugin.prototype.id = "";

  Plugin.included = function(klass) {
    var self;
    self = this;
    return klass.before_create(function() {
      return this.attach_plugin(self);
    });
  };

  Plugin.attached = function(instance) {
    return (new this()).initialize(instance);
  };

  Plugin.prototype.initialize = function(instance) {
    instance[this.id] = this;
    return instance["has_" + this.id] = true;
  };

  return Plugin;

})(pi.Core);



},{"../core":33}],57:[function(require,module,exports){
'use strict';
var pi, utils, _singular, _wrap,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

utils = pi.utils;

pi.resources = {};

pi["export"](pi.resources, "$r");

_singular = function(str) {
  return str.replace(/s$/, '');
};

_wrap = function(el) {
  var data;
  if (el instanceof pi.resources.Base) {
    data = {};
    data[el.constructor.resource_name] = el;
    return data;
  } else {
    return el;
  }
};

pi.resources.Base = (function(_super) {
  __extends(Base, _super);

  Base.set_resource = function(plural, singular) {
    this.__all_by_id__ = {};
    this.__all__ = [];
    this.resources_name = plural;
    return this.resource_name = singular || _singular(plural);
  };

  Base.load = function(data) {
    var el, _i, _len, _results;
    if (data != null) {
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        el = data[_i];
        _results.push(this.build(el, true));
      }
      return _results;
    }
  };

  Base.clear_all = function() {
    var el, _i, _len, _ref;
    _ref = this.__all__;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      el.dispose;
    }
    this.__all_by_id__ = {};
    return this.__all__.length = 0;
  };

  Base.get = function(id) {
    return this.__all_by_id__[id];
  };

  Base.add = function(el) {
    this.__all_by_id__[el.id] = el;
    return this.__all__.push(el);
  };

  Base.build = function(data, silent, add) {
    var el;
    if (data == null) {
      data = {};
    }
    if (silent == null) {
      silent = false;
    }
    if (add == null) {
      add = true;
    }
    if (!(data.id && (el = this.get(data.id)))) {
      el = new this(data);
      if (el.id && add) {
        this.add(el);
        if (!silent) {
          this.trigger('create', _wrap(el));
        }
      }
      return el;
    } else {
      return el.set(data);
    }
  };

  Base.remove_by_id = function(id, silent) {
    var el;
    el = this.get(id);
    if (el != null) {
      this.remove(el);
    }
    return false;
  };

  Base.remove = function(el, silent) {
    if (el instanceof this) {
      if (this.__all_by_id__[el.id] != null) {
        this.__all__.splice(this.__all__.indexOf(el), 1);
        delete this.__all_by_id__[el.id];
      }
      if (!silent) {
        this.trigger('destroy', _wrap(el));
      }
      el.dispose();
      return true;
    }
    return false;
  };

  Base.listen = function(callback) {
    return pi.event.on("" + this.resources_name + "_update", callback);
  };

  Base.trigger = function(event, data) {
    return pi.event.trigger("" + this.resources_name + "_update", utils.merge(data, {
      type: event
    }));
  };

  Base.off = function(callback) {
    if (callback != null) {
      return pi.event.off("" + this.resources_name + "_update", callback);
    } else {
      return pi.event.off("" + this.resources_name + "_update");
    }
  };

  Base.all = function() {
    return this.__all__.slice();
  };

  function Base(data) {
    this.set(data, true);
  }

  Base.prototype.dispose = function() {
    var key, _;
    for (key in this) {
      if (!__hasProp.call(this, key)) continue;
      _ = this[key];
      delete this[key];
    }
    this.disposed = true;
    return this;
  };

  Base.prototype.set = function(params, silent) {
    var key, val, _changed;
    _changed = false;
    for (key in params) {
      if (!__hasProp.call(params, key)) continue;
      val = params[key];
      if (this[key] !== val) {
        _changed = true;
      }
      this[key] = val;
    }
    if (_changed && !silent) {
      this.trigger('update');
    }
    return this;
  };

  Base.prototype.trigger = function(e) {
    return this.constructor.trigger(e, _wrap(this));
  };

  return Base;

})(pi.Core);



},{"../core":33}],58:[function(require,module,exports){
'use strict';
require('./base');

require('./rest');

require('./modules');



},{"./base":57,"./modules":59,"./rest":61}],59:[function(require,module,exports){
'use strict';
require('./query');



},{"./query":60}],60:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../../core');

require('../rest');

utils = pi.utils;

pi.resources.Query = (function() {
  function Query() {}

  Query.extended = function(klass) {
    return klass.query_path = klass.fetch_path;
  };

  Query.query = function(params) {
    return this._request(this.query_path, 'get', params).then((function(_this) {
      return function(response) {
        return _this.on_query(response);
      };
    })(this));
  };

  Query.on_query = function(data) {
    var el, query_data, _i, _len, _ref, _results;
    if (data[this.resources_name] != null) {
      _ref = data[this.resources_name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(query_data = this.build(el, true, false));
      }
      return _results;
    }
  };

  return Query;

})();



},{"../../core":33,"../rest":61}],61:[function(require,module,exports){
'use strict';
var pi, utils, _double_slashes_reg, _path_reg, _tailing_slash_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base');

utils = pi.utils;

_path_reg = /:(\w+)\b/g;

_double_slashes_reg = /\/\//;

_tailing_slash_reg = /\/$/;

pi.resources.REST = (function(_super) {
  __extends(REST, _super);

  function REST() {
    return REST.__super__.constructor.apply(this, arguments);
  }

  REST._rscope = "/:path";

  REST.set_resource = function(plural, singular) {
    REST.__super__.constructor.set_resource.apply(this, arguments);
    return this.routes({
      collection: [
        {
          action: 'show',
          path: ":resources/:id",
          method: "get"
        }, {
          action: 'fetch',
          path: ":resources",
          method: "get"
        }
      ],
      member: [
        {
          action: 'update',
          path: ":resources/:id",
          method: "patch"
        }, {
          action: 'destroy',
          path: ":resources/:id",
          method: "delete"
        }, {
          action: 'create',
          path: ":resources",
          method: "post"
        }
      ]
    });
  };

  REST.routes = function(data) {
    var spec, _fn, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (data.collection != null) {
      _ref = data.collection;
      _fn = (function(_this) {
        return function(spec) {
          _this[spec.action] = function(params) {
            if (params == null) {
              params = {};
            }
            return this._request(spec.path, spec.method, params).then((function(_this) {
              return function(response) {
                if (_this["on_" + spec.action] != null) {
                  return _this["on_" + spec.action](response);
                } else {
                  return response;
                }
              };
            })(this));
          };
          return _this["" + spec.action + "_path"] = spec.path;
        };
      })(this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        spec = _ref[_i];
        _fn(spec);
      }
    }
    if (data.member != null) {
      _ref1 = data.member;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        spec = _ref1[_j];
        _results.push((function(_this) {
          return function(spec) {
            _this.prototype[spec.action] = function(params) {
              if (params == null) {
                params = {};
              }
              return this.constructor._request(spec.path, spec.method, utils.merge(params, {
                id: this.id
              })).then((function(_this) {
                return function(response) {
                  if (_this["on_" + spec.action] != null) {
                    return _this["on_" + spec.action](response);
                  } else {
                    return response;
                  }
                };
              })(this));
            };
            return _this.prototype["" + spec.action + "_path"] = spec.path;
          };
        })(this)(spec));
      }
      return _results;
    }
  };

  REST.routes_scope = function(scope) {
    return this._rscope = scope;
  };

  REST._interpolate_path = function(path, params) {
    var flag, part, path_parts, _i, _len;
    path_parts = path.split(_path_reg);
    path = "";
    flag = false;
    for (_i = 0, _len = path_parts.length; _i < _len; _i++) {
      part = path_parts[_i];
      if (flag) {
        path += params[part];
      } else {
        path += part;
      }
      flag = !flag;
    }
    return (this._rscope.replace(":path", path)).replace(_double_slashes_reg, "/").replace(_tailing_slash_reg, '');
  };

  REST.error = function(action, message) {
    return pi.event.trigger("net_error", {
      resource: this.resources_name,
      action: action,
      message: message
    });
  };

  REST._request = function(path, method, params) {
    path = this._interpolate_path(path, utils.merge(params, {
      resources: this.resources_name,
      resource: this.resource_name
    }));
    return pi.net[method].call(null, path, params)["catch"]((function(_this) {
      return function(error) {
        _this.error(error.message);
        throw error;
      };
    })(this));
  };

  REST.on_show = function(data) {
    var el;
    if (data[this.resource_name] != null) {
      el = this.build(data[this.resource_name], true);
      el._persisted = true;
      return el;
    }
  };

  REST.on_fetch = function(data) {
    if (data[this.resources_name] != null) {
      return this.load(data[this.resources_name]);
    }
  };

  REST.find = function(id) {
    var el;
    el = this.get(id);
    if (el != null) {
      return new Promise((function(_this) {
        return function(resolve) {
          return resolve(el);
        };
      })(this));
    } else {
      return this.show({
        id: id
      });
    }
  };

  REST.create = function(data) {
    var el;
    el = this.build(data);
    return el.save();
  };

  REST.prototype.on_destroy = function(data) {
    this.constructor.remove(this);
    return data;
  };

  REST.prototype.on_update = function(data) {
    var params;
    params = data[this.constructor.resource_name];
    if ((params != null) && params.id === this.id) {
      return this.set(params);
    }
  };

  REST.prototype.on_create = function(data) {
    var params;
    params = data[this.constructor.resource_name];
    if (params != null) {
      this.set(params, true);
      this._persisted = true;
      this.constructor.add(this);
      this.trigger('create');
      return this;
    }
  };

  REST.prototype.save = function() {
    if (this._persisted) {
      return this.update(this.attributes());
    } else {
      return this.create(this.attributes());
    }
  };

  REST.prototype.attributes = function() {
    var key, res, val;
    res = {};
    for (key in this) {
      if (!__hasProp.call(this, key)) continue;
      val = this[key];
      if (key[0] !== "_") {
        res[key] = val;
      }
    }
    return res;
  };

  return REST;

})(pi.resources.Base);



},{"../core":33,"./base":57}],62:[function(require,module,exports){
'use strict';
require('./view');

require('./plugins');

require('./list.view');



},{"./list.view":63,"./plugins":64,"./view":66}],63:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./view');

utils = pi.utils;

pi.View.List = (function(_super) {
  __extends(List, _super);

  function List() {
    return List.__super__.constructor.apply(this, arguments);
  }

  List.requires('list', 'loader');

  List.prototype.loading = function(value) {
    if (value === true) {
      this.loader.reset();
      this.loader.start();
      return this.loader.simulate();
    } else if (value === false) {
      return this.loader.stop();
    }
  };

  List.prototype.sort = function(params) {
    return this.list.sort(params);
  };

  List.prototype.sorted = function(params) {
    if (params != null) {
      return this.list.sortable.sorted(params);
    }
  };

  List.prototype.search = function(query) {
    this._query = query;
    return this.list.search(query, true);
  };

  List.prototype.searched = function(query) {
    utils.debug("loaded search " + query);
    this.list.searchable.start_search();
    if (query) {
      return this.list.highlight(query);
    } else {
      return this.list.searchable.stop_search(false);
    }
  };

  List.prototype.filter = function(data) {
    return this.list.filter(data);
  };

  List.prototype.filtered = function(data) {
    utils.debug("loaded filter", data);
    this.list.filterable.start_filter();
    if (data != null) {
      return this.list.trigger('filter_update');
    } else {
      return this.list.filterable.stop_filter(false);
    }
  };

  List.prototype.clear = function(data) {
    var _ref;
    utils.debug('clear list');
    this.list.clear();
    this.list.clear_selection() != null;
    return (_ref = this.list.scroll_end) != null ? _ref.disable() : void 0;
  };

  List.prototype.load = function(data) {
    var item, _i, _len;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      this.list.add_item(item, true);
    }
    return this.list.update();
  };

  List.prototype.reload = function(data) {
    this.list.data_provider(data);
    if (this._query) {
      return this.searched(this._query);
    }
  };

  List.prototype.error = function(message) {
    return utils.error(message);
  };

  List.prototype.success = function(message) {
    return utils.info(message);
  };

  return List;

})(pi.View.Base);



},{"../core":33,"./view":66}],64:[function(require,module,exports){
'use strict';
require('./list.restful');



},{"./list.restful":65}],65:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../plugins/plugin');

require('../../components/base/list');

utils = pi.utils;

pi.List.Restful = (function(_super) {
  __extends(Restful, _super);

  function Restful() {
    return Restful.__super__.constructor.apply(this, arguments);
  }

  Restful.prototype.id = 'restful';

  Restful.prototype.initialize = function(list) {
    this.list = list;
    Restful.__super__.initialize.apply(this, arguments);
    if ((this.list.options.rest != null) && ($r[utils.camelCase(this.list.options.rest)] != null)) {
      this.resources = $r[utils.camelCase(this.list.options.rest)];
      this.resources.listen(this.resource_update());
      this.list.delegate_to(this, 'find_by_id');
    }
  };

  Restful.prototype.find_by_id = function(id) {
    var items;
    items = this.list.where({
      record: {
        id: id | 0
      }
    });
    if (items.length) {
      return items[0];
    }
  };

  Restful.prototype.resource_update = function() {
    return this._resource_update || (this._resource_update = (function(_this) {
      return function(e) {
        var _ref;
        utils.debug('Resful list event', e.data.type);
        return (_ref = _this["on_" + e.data.type]) != null ? _ref.call(_this, e.data[_this.resources.resource_name]) : void 0;
      };
    })(this));
  };

  Restful.prototype.on_create = function(data) {
    return this.list.add_item(data);
  };

  Restful.prototype.on_destroy = function(data) {
    var item;
    if ((item = this.find_by_id(data.id))) {
      return this.list.remove_item(item);
    }
  };

  Restful.prototype.on_update = function(data) {
    var item;
    if ((item = this.find_by_id(data.id))) {
      return this.list.update_item(item, data);
    }
  };

  return Restful;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":33,"../../plugins/plugin":56}],66:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('../components/pieces');

utils = pi.utils;

pi.View = {};

utils.extend(pi.Base.prototype, {
  view: function() {
    return this.__view__ || (this.__view__ = this._find_view());
  },
  _find_view: function() {
    var comp;
    comp = this;
    while (comp) {
      if (comp instanceof pi.View.Base) {
        return comp;
      }
      comp = comp.host;
    }
  }
});

pi.View.Base = (function(_super) {
  __extends(Base, _super);

  function Base() {
    return Base.__super__.constructor.apply(this, arguments);
  }

  Base.prototype.postinitialize = function() {
    var controller, controller_klass;
    controller_klass = null;
    if (this.options.controller) {
      controller_klass = utils.get_class_path(pi.controllers, this.options.controller);
    }
    controller_klass || (controller_klass = this.default_controller);
    if (controller_klass != null) {
      controller = new controller_klass(this);
      return pi.app.page.add_context(controller, this.options.main);
    }
  };

  Base.prototype.loaded = function(data) {};

  Base.prototype.unloaded = function() {};

  return Base;

})(pi.Base);



},{"../components/pieces":12,"../core":33}]},{},[44]);

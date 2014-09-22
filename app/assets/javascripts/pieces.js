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

  ActionList.include_plugins(pi.List.Selectable, pi.List.Sortable, pi.List.Searchable, pi.List.Filterable, pi.List.ScrollEnd);

  return ActionList;

})(pi.List);

pi.Guesser.rules_for('action_list', ['pi-action-list']);



},{"../core":45,"../plugins/list":65,"./base/list":6}],2:[function(require,module,exports){
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



},{"../core/pi":47,"./pieces":17}],3:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../pieces');

require('../events/input_events');

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

  BaseInput.prototype.clear = function(silent) {
    if (silent == null) {
      silent = false;
    }
    this.input.value('');
    if (!silent) {
      return this.trigger(pi.InputEvent.Clear);
    }
  };

  return BaseInput;

})(pi.Base);



},{"../../core":45,"../events/input_events":12,"../pieces":17}],4:[function(require,module,exports){
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



},{"../../core":45,"../pieces":17}],5:[function(require,module,exports){
'use strict';
require('./base_input');

require('./button');

require('./list');

require('./textinput');



},{"./base_input":3,"./button":4,"./list":6,"./textinput":7}],6:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pi = require('../../core');

require('../pieces');

require('../../plugins/base/renderable');

utils = pi.utils;

pi.List = (function(_super) {
  __extends(List, _super);

  function List() {
    return List.__super__.constructor.apply(this, arguments);
  }

  List.include_plugins(pi.Base.Renderable);

  List.prototype.merge_classes = ['is-disabled', 'is-active', 'is-hidden'];

  List.prototype.preinitialize = function() {
    List.__super__.preinitialize.apply(this, arguments);
    this.list_klass = this.options.list_klass || 'list';
    this.item_klass = this.options.item_klass || 'item';
    this.items = [];
    return this.buffer = document.createDocumentFragment();
  };

  List.prototype.initialize = function() {
    List.__super__.initialize.apply(this, arguments);
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
        return _this.add_item(pi.Nod.create(node), true);
      };
    })(this));
    return this._flush_buffer();
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
        this.add_item(item, true);
      }
    }
    this.update('load');
    return this;
  };

  List.prototype.add_item = function(data, silent) {
    var item;
    if (silent == null) {
      silent = false;
    }
    item = this._create_item(data);
    if (item == null) {
      return;
    }
    this.items.push(item);
    this._check_empty();
    item.data('list-index', this.items.length - 1);
    if (!silent) {
      this.items_cont.append(item);
    } else {
      this.buffer.appendChild(item.node);
    }
    if (!silent) {
      this.trigger('update', {
        type: 'item_added',
        item: item
      });
    }
    return item;
  };

  List.prototype.add_item_at = function(data, index, silent) {
    var item, _after;
    if (silent == null) {
      silent = false;
    }
    if (this.items.length - 1 < index) {
      return this.add_item(data, silent);
    }
    item = this._create_item(data);
    this.items.splice(index, 0, item);
    _after = this.items[index + 1];
    item.data('list-index', index);
    _after.insertBefore(item);
    this._need_update_indeces = true;
    if (!silent) {
      this._update_indeces();
      this.trigger('update', {
        type: 'item_added',
        item: item
      });
    }
    return item;
  };

  List.prototype.remove_item = function(item, silent) {
    var index;
    if (silent == null) {
      silent = false;
    }
    index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this._destroy_item(item);
      this._check_empty();
      this._need_update_indeces = true;
      if (!silent) {
        this._update_indeces();
        this.trigger('update', {
          type: 'item_removed',
          item: item
        });
      }
      return true;
    } else {
      return false;
    }
  };

  List.prototype.remove_item_at = function(index, silent) {
    var item;
    if (silent == null) {
      silent = false;
    }
    if (this.items.length - 1 < index) {
      return;
    }
    item = this.items[index];
    return this.remove_item(item, silent);
  };

  List.prototype.remove_items = function(items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      this.remove_item(item, true);
    }
    this.update();
  };

  List.prototype.update_item = function(item, data, silent) {
    var klass, new_item, _i, _len, _ref;
    if (silent == null) {
      silent = false;
    }
    new_item = this._renderer.render(data, false);
    utils.extend(item.record, new_item.record, true);
    item.remove_children();
    item.html(new_item.html());
    _ref = item.node.className.split(/\s+/);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      klass = _ref[_i];
      if (klass && !(__indexOf.call(this.merge_classes, klass) >= 0)) {
        item.removeClass(klass);
      }
    }
    item.mergeClasses(new_item);
    item.piecify();
    if (!silent) {
      this.trigger('update', {
        type: 'item_updated',
        item: item
      });
    }
    return item;
  };

  List.prototype.move_item = function(item, index) {
    var _after;
    if ((item.data('list-index') === index) || (index > this.items.length - 1)) {
      return;
    }
    this.items.splice(this.items.indexOf(item), 1);
    if (index === this.items.length) {
      this.items.push(item);
      this.items_cont.append(item);
    } else {
      this.items.splice(index, 0, item);
      _after = this.items[index + 1];
      _after.insertBefore(item);
    }
    this._need_update_indeces = true;
    this._update_indeces();
    return item;
  };

  List.prototype.where = function(query) {
    var item, matcher, _i, _len, _ref, _results;
    matcher = typeof query === "string" ? utils.matchers.nod(query) : utils.matchers.object(query);
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

  List.prototype.records = function() {
    return this.items.map(function(item) {
      return item.record;
    });
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
    this.trigger('update', {
      type: 'clear'
    });
    return this._check_empty();
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
    item = this._renderer.render(data);
    if (item == null) {
      return;
    }
    item.is_list_item = true;
    item.host = this;
    return item;
  };

  List.prototype._destroy_item = function(item) {
    item.remove();
    return item.dispose();
  };

  List.prototype._flush_buffer = function(append) {
    var _results;
    if (append == null) {
      append = true;
    }
    if (append) {
      this.items_cont.append(this.buffer);
    }
    _results = [];
    while (this.buffer.firstChild) {
      _results.push(this.buffer.removeChild(this.buffer.firstChild));
    }
    return _results;
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

pi.Guesser.rules_for('list', ['pi-list'], ['ul'], function(nod) {
  return nod.children('ul').length === 1;
});



},{"../../core":45,"../../plugins/base/renderable":60,"../pieces":17}],7:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../pieces');

require('./base_input');

require('../events/input_events');

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
      this.readonly();
    }
    return this.input.on('change', (function(_this) {
      return function(e) {
        e.cancel();
        return _this.trigger(pi.InputEvent.Change, _this.value());
      };
    })(this));
  };

  TextInput.prototype.edit = function() {
    if (!this.editable) {
      this.input.attr('readonly', null);
      this.removeClass('is-readonly');
      this.editable = true;
      this.trigger(pi.InputEvent.Editable, true);
    }
    return this;
  };

  TextInput.prototype.readonly = function() {
    if (this.editable) {
      this.input.attr('readonly', 'readonly');
      this.addClass('is-readonly');
      this.editable = false;
      this.blur();
      this.trigger(pi.InputEvent.Editable, false);
    }
    return this;
  };

  return TextInput;

})(pi.BaseInput);

pi.Guesser.rules_for('text_input', ['pi-text-input-wrap'], ['input[text]']);



},{"../../core":45,"../events/input_events":12,"../pieces":17,"./base_input":3}],8:[function(require,module,exports){
'use strict';
var pi, utils, _type_rxp;

pi = require('../../core');

require('./base_input');

utils = pi.utils;

_type_rxp = /(\w+)(?:\(([\w\-\/]+)\))/;

pi.BaseInput.Validator = (function() {
  function Validator() {}

  Validator.add = function(name, fun) {
    return this[name] = fun;
  };

  Validator.validate = function(type, nod, form) {
    var data, matches;
    if ((matches = type.match(_type_rxp))) {
      type = matches[1];
      data = utils.serialize(matches[2]);
    }
    return this[type](nod.value(), nod, form, data);
  };

  Validator.email = function(val) {
    return utils.is_email(val);
  };

  Validator.len = function(val, nod, form, data) {
    return (val + "").length >= data;
  };

  Validator.truth = function(val) {
    return !!utils.serialize(val);
  };

  Validator.presence = function(val) {
    return val && ((val + "").length > 0);
  };

  Validator.digital = function(val) {
    return utils.is_digital(val + "");
  };

  Validator.confirm = function(val, nod, form) {
    var conf_nod, confirm_name;
    confirm_name = nod.name().replace(/([\]]+)?$/, "_confirmation$1");
    conf_nod = form.find_by_name(confirm_name);
    if (conf_nod == null) {
      return false;
    }
    return conf_nod.value() === val;
  };

  return Validator;

})();



},{"../../core":45,"./base_input":3}],9:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

require('./events/input_events');

utils = pi.utils;

pi.Checkbox = (function(_super) {
  __extends(Checkbox, _super);

  function Checkbox() {
    return Checkbox.__super__.constructor.apply(this, arguments);
  }

  Checkbox.prototype.postinitialize = function() {
    Checkbox.__super__.postinitialize.apply(this, arguments);
    this.attr('tabindex', 0);
    this.__selected__ = false;
    if (this.options.selected || this.hasClass('is-selected') || (this.value() | 0)) {
      this.select();
    }
    return this.on('click', (function(_this) {
      return function(e) {
        e.cancel();
        return _this.toggle_select();
      };
    })(this));
  };

  Checkbox.prototype.select = function(silent) {
    if (silent == null) {
      silent = false;
    }
    if (!this.__selected__) {
      this.addClass('is-selected');
      this.__selected__ = true;
      this.input.value(1);
      if (!silent) {
        return this.trigger(pi.InputEvent.Change, true);
      }
    }
  };

  Checkbox.prototype.deselect = function(silent) {
    if (silent == null) {
      silent = false;
    }
    if (this.__selected__) {
      this.removeClass('is-selected');
      this.__selected__ = false;
      this.input.value(0);
      if (!silent) {
        return this.trigger(pi.InputEvent.Change, false);
      }
    }
  };

  Checkbox.prototype.toggle_select = function(silent) {
    if (this.__selected__) {
      return this.deselect(silent);
    } else {
      return this.select(silent);
    }
  };

  Checkbox.prototype.value = function(val) {
    if (val != null) {
      Checkbox.__super__.value.apply(this, arguments);
      this.__selected__ = !val;
      return this.toggle_select(true);
    } else {
      return Checkbox.__super__.value.apply(this, arguments);
    }
  };

  Checkbox.prototype.clear = function(silent) {
    if (silent == null) {
      silent = false;
    }
    this.value(false);
    if (!silent) {
      return this.trigger(pi.InputEvent.Clear);
    }
  };

  return Checkbox;

})(pi.BaseInput);

pi.Guesser.rules_for('checkbox', ['pi-checkbox-wrap'], null);



},{"../core":45,"./base/base_input":3,"./events/input_events":12}],10:[function(require,module,exports){
'use strict';
var pi, utils, _call_rxp, _condition_rxp, _fun_rxp, _method_rxp, _null, _op_rxp, _operators, _str_rxp, _true,
  __slice = [].slice;

pi = require('../core');

utils = pi.utils;

_method_rxp = /([\w\.]+)\.(\w+)/;

_str_rxp = /^['"].+['"]$/;

_condition_rxp = /^([\w\.\(\)@'"-=><]+)\s*\?\s*([\w\.\(\)@'"-]+)\s*(?:\:\s*([\w\.\(\)@'"-]+)\s*)$/;

_fun_rxp = /^(@?\w+)(?:\.([\w\.]+)(?:\(([@\w\.\(\),'"-]+)\))?)?$/;

_op_rxp = /(>|<|=)/;

_true = function() {
  return true;
};

_null = function() {};

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

_call_rxp = /\(\)/;

pi.Compiler = (function() {
  function Compiler() {}

  Compiler.modifiers = [];

  Compiler.process_modifiers = function(str) {
    var fun, _i, _len, _ref;
    _ref = this.modifiers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fun = _ref[_i];
      str = fun.call(null, str);
    }
    return str;
  };

  Compiler.call = function(owner, target, method_chain, fixed_args) {
    var arg, error, key_, method, method_, target_, target_chain, _, _ref, _ref1;
    try {
      utils.debug("pi call: target - " + target + "; method chain - " + method_chain);
      target = (function() {
        switch (false) {
          case typeof target !== 'object':
            return target;
          case target[0] !== '@':
            return pi.find(target.slice(1), owner);
          default:
            return this[target];
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
          _ref = method_chain.match(_method_rxp), _ = _ref[0], target_chain = _ref[1], method_ = _ref[2];
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
      return utils.error(error, error.stack);
    }
  };

  Compiler.is_simple_arg = function(arg) {
    return !(_method_rxp.test(arg) || arg[0] === '@');
  };

  Compiler.prepare_arg = function(arg, host) {
    if (this.is_simple_arg(arg)) {
      if (_str_rxp.test(arg)) {
        return arg.slice(1, -1);
      } else {
        return utils.serialize(arg);
      }
    } else {
      return this.str_to_fun(arg, host);
    }
  };

  Compiler._conditional = function(condition, resolve, reject) {
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

  Compiler.str_to_fun = function(callstr, host) {
    var condition, matches, reject, resolve;
    callstr = this.process_modifiers(callstr);
    if ((matches = callstr.match(_condition_rxp))) {
      condition = this.compile_condition(matches[1], host);
      resolve = this.compile_fun(matches[2], host);
      reject = matches[3] ? this.compile_fun(matches[3], host) : _true;
      return this._conditional(condition, resolve, reject);
    } else {
      return this.compile_fun(callstr, host);
    }
  };

  Compiler.compile_condition = function(callstr, host) {
    var matches, parts;
    if ((matches = callstr.match(_op_rxp))) {
      parts = callstr.split(_op_rxp);
      return _operators[matches[1]](this.prepare_arg(parts[0]), this.prepare_arg(parts[2]));
    } else {
      return this.compile_fun(callstr, host);
    }
  };

  Compiler.parse_str = function(callstr) {
    var matches, res;
    if ((matches = callstr.match(_fun_rxp))) {
      return res = {
        target: matches[1],
        method_chain: matches[2],
        args: matches[3] ? matches[3].split(",") : []
      };
    } else {
      return false;
    }
  };

  Compiler.compile_fun = function(callstr, target) {
    var arg, data;
    if ((data = this.parse_str(callstr))) {
      data.target = (function() {
        switch (false) {
          case data.target !== '@this':
            return target;
          case data.target !== '@app':
            return pi.app;
          case data.target !== '@host':
            return target.host;
          case data.target !== '@view':
            return typeof target.view === "function" ? target.view() : void 0;
          default:
            return data.target;
        }
      })();
      if (data.method_chain) {
        return utils.curry(pi.call, [
          target, data.target, data.method_chain, (data.args ? (function() {
            var _i, _len, _ref, _results;
            _ref = data.args;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              _results.push(this.prepare_arg(arg, target));
            }
            return _results;
          }).call(this) : [])
        ]);
      } else {
        return utils.curry(pi.call, [target, data.target, void 0, void 0]);
      }
    } else {
      utils.error("cannot compile function: " + callstr);
      return _null;
    }
  };

  Compiler.str_to_event_handler = function(callstr, host) {
    var _f;
    callstr = callstr.replace(/\be\b/, "e");
    _f = this.str_to_fun(callstr, host);
    return function(e) {
      return _f.call({
        e: e
      });
    };
  };

  return Compiler;

})();

pi.call = pi.Compiler.call;

pi.Compiler.modifiers.push(function(str) {
  return str.replace(_call_rxp, '');
});



},{"../core":45}],11:[function(require,module,exports){
require('./input_events')
},{"./input_events":12}],12:[function(require,module,exports){
'use strict';
var pi;

pi = require('../../core');

pi.InputEvent = {
  Change: 'changed',
  Clear: 'cleared',
  Editable: 'editable'
};

pi.FormEvent = {
  Update: 'updated',
  Submit: 'submited',
  Invalid: 'invalid'
};



},{"../../core":45}],13:[function(require,module,exports){
'use strict';
var pi, utils, _name_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

require('./events/input_events');

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
    this._multiple = !!this.input.attr('multiple');
    this.input.attr('tabindex', '-1');
    return this.input.on('change', (function(_this) {
      return function(e) {
        var file, _i, _len, _ref;
        e.cancel();
        _this._files.length = 0;
        if (_this.input.node.files == null) {
          if (_this.input.node.value) {
            _this._files.push({
              name: _this.input.node.value.split(_name_reg)[1]
            });
            _this.trigger(pi.InputEvent.Change, _this.value());
          }
          return;
        }
        if (_this.input.node.files.length) {
          _ref = _this.input.node.files;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            _this._files.push(file);
          }
          return _this.trigger(pi.InputEvent.Change, _this.value());
        } else {
          return _this.clear();
        }
      };
    })(this));
  };

  FileInput.prototype.multiple = function(value) {
    this._multiple = value;
    if (value) {
      return this.input.attr('multiple', '');
    } else {
      return this.input.attr('multiple', null);
    }
  };

  FileInput.prototype.clear = function() {
    this._files.length = 0;
    return FileInput.__super__.clear.apply(this, arguments);
  };

  FileInput.prototype.value = function() {
    if (this._multiple) {
      return this._files;
    } else {
      return this._files[0];
    }
  };

  return FileInput;

})(pi.BaseInput);

pi.Guesser.rules_for('file_input', ['pi-file-input-wrap'], ['input[file]'], function(nod) {
  return nod.children("input[type=file]").length === 1;
});



},{"../core":45,"./base/base_input":3,"./events/input_events":12}],14:[function(require,module,exports){
'use strict';
var Validator, pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./events/input_events');

require('./base/validator');

utils = pi.utils;

Validator = pi.BaseInput.Validator;

pi.Form = (function(_super) {
  __extends(Form, _super);

  function Form() {
    return Form.__super__.constructor.apply(this, arguments);
  }

  Form.prototype.postinitialize = function() {
    Form.__super__.postinitialize.apply(this, arguments);
    this._cache = {};
    this._value = {};
    this._invalids = [];
    this.former = new pi.Former(this.node, {
      serialize: !!this.options.serialize,
      rails: this.options.rails,
      clear_hidden: this.options.clear_hidden
    });
    this.read_values();
    this.on(pi.InputEvent.Change, (function(_this) {
      return function(e) {
        e.cancel();
        if (_this.validate_nod(e.target)) {
          return _this.update_value(e.target.name(), e.data);
        }
      };
    })(this));
    this.on('change', (function(_this) {
      return function(e) {
        if (!utils.is_input(e.target.node)) {
          return;
        }
        if (_this.validate_nod(e.target)) {
          return _this.update_value(e.target.node.name, _this.former._parse_nod_value(e.target.node));
        }
      };
    })(this));
    this.form = this.node.nodeName === 'FORM' ? this : this.find('form');
    if (this.form != null) {
      return this.form.on('submit', (function(_this) {
        return function(e) {
          e.cancel();
          return _this.submit();
        };
      })(this));
    }
  };

  Form.prototype.submit = function() {
    this.read_values();
    if (this.validate() === true) {
      return this.trigger(pi.FormEvent.Submit, this._value);
    }
  };

  Form.prototype.value = function(val) {
    if (val != null) {
      this._value = {};
      this.former.traverse_nodes(this.node, (function(_this) {
        return function(node) {
          return _this.fill_value(node, val);
        };
      })(this));
      this.read_values();
      return this;
    } else {
      return this._value;
    }
  };

  Form.prototype.clear = function(silent) {
    if (silent == null) {
      silent = false;
    }
    this._value = {};
    this.former.traverse_nodes(this.node, (function(_this) {
      return function(node) {
        return _this.clear_value(node);
      };
    })(this));
    if (this.former.options.clear_hidden === false) {
      this.read_values();
    }
    if (!silent) {
      return this.trigger(pi.InputEvent.Clear);
    }
  };

  Form.prototype.read_values = function() {
    return this.former.traverse_nodes(this.node, (function(_this) {
      return function(node) {
        var nod;
        if (((nod = node._nod) instanceof pi.BaseInput) && nod.name()) {
          _this._cache[nod.name()] = nod;
          return _this.update_value(nod.name(), nod.value(), true);
        } else if (utils.is_input(node) && node.name) {
          _this._cache[node.name] = pi.Nod.create(node);
          return _this.update_value(node.name, _this.former._parse_nod_value(node));
        }
      };
    })(this));
  };

  Form.prototype.find_by_name = function(name) {
    var nod;
    if (this._cache[name] != null) {
      return this._cache[name];
    }
    nod = this.find("[name=" + name + "]");
    if (nod != null) {
      return (this._cache[name] = nod);
    }
  };

  Form.prototype.fill_value = function(node, val) {
    var nod;
    if (((nod = node._nod) instanceof pi.BaseInput) && nod.name()) {
      val = this.former._nod_data_value(nod.name(), val);
      if (val == null) {
        return;
      }
      return nod.value(val);
    } else if (utils.is_input(node)) {
      return this.former._fill_nod(node, val);
    }
  };

  Form.prototype.validate = function() {
    this.former.traverse_nodes(this.node, (function(_this) {
      return function(node) {
        return _this.validate_value(node);
      };
    })(this));
    if (this._invalids.length) {
      this.trigger(pi.FormEvent.Invalid, this._invalids);
      return false;
    } else {
      return true;
    }
  };

  Form.prototype.validate_value = function(node) {
    var nod;
    if ((nod = node._nod) instanceof pi.BaseInput) {
      return this.validate_nod(nod);
    }
  };

  Form.prototype.validate_nod = function(nod) {
    var flag, type, types, _i, _len, _ref;
    if ((types = nod.data('validates'))) {
      flag = true;
      _ref = types.split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        if (!Validator.validate(type, nod, this)) {
          nod.addClass('is-invalid');
          flag = false;
          break;
        }
      }
      if (flag) {
        nod.removeClass('is-invalid');
        if (nod.__invalid__) {
          this._invalids.splice(this._invalids.indexOf(nod.name()), 1);
          delete nod.__invalid__;
        }
        return true;
      } else {
        if (nod.__invalid__ == null) {
          this._invalids.push(nod.name());
        }
        nod.__invalid__ = true;
        return false;
      }
    } else {
      return true;
    }
  };

  Form.prototype.clear_value = function(node) {
    var nod;
    if ((nod = node._nod) instanceof pi.BaseInput) {
      return nod.clear();
    } else if (utils.is_input(node)) {
      return this.former._clear_nod(node);
    }
  };

  Form.prototype.update_value = function(name, val, silent) {
    if (silent == null) {
      silent = false;
    }
    if (!name) {
      return;
    }
    name = this.former.transform_name(name);
    val = this.former.transform_value(val);
    utils.set_path(this._value, name, val);
    if (!silent) {
      return this.trigger(pi.FormEvent.Update, this._value);
    }
  };

  return Form;

})(pi.Base);

pi.Guesser.rules_for('form', ['pi-form'], ['form']);



},{"../core":45,"./base/validator":8,"./events/input_events":12}],15:[function(require,module,exports){
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



},{"../../core":45}],16:[function(require,module,exports){
'use strict';
require('./pieces');

require('./app');

require('./guess/guesser');

require('./events');

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

require('./sorters');

require('./popup_container');

require('./form');

require('./radio_group');

require('./stepper');



},{"../plugins/index":63,"./action_list":1,"./app":2,"./base/index":5,"./checkbox":9,"./events":11,"./file_input":13,"./form":14,"./guess/guesser":15,"./pieces":17,"./popup_container":18,"./progress_bar":19,"./radio_group":20,"./renderers":22,"./search_input":25,"./select_input":26,"./sorters":27,"./stepper":28,"./swf_player":29,"./textarea":30,"./toggle_button":31}],17:[function(require,module,exports){
'use strict';
var Nod, event_re, pi, utils, _array_rxp,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

pi = require('../core');

require('./compiler');

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
    this.initialize();
    this.init_plugins();
    this.init_children();
    this.setup_events();
    this.postinitialize();
  }

  Base.prototype.piecify = function() {
    var c, _i, _len, _ref, _results;
    this.__components__.length = 0;
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

  Base.register_callback('initialize');

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
        var arr, child, _name;
        child = pi.init_component(node, _this);
        if (child != null ? child.pid : void 0) {
          if (_array_rxp.test(child.pid)) {
            arr = (_this[_name = child.pid.slice(0, -2)] || (_this[_name] = []));
            if (!(arr.indexOf(child) > -1)) {
              arr.push(child);
            }
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
        this.on(event, pi.Compiler.str_to_event_handler(handler, this));
      }
    }
    delete this.options.events;
  };

  Base.prototype.postinitialize = function() {
    return this.trigger('creation_complete', true, false);
  };

  Base.register_callback('postinitialize', {
    as: 'create'
  });

  Base.prototype.dispose = function() {
    Base.__super__.dispose.apply(this, arguments);
    if (this.host != null) {
      this.host.remove_component(this);
    }
    this.trigger('destroyed', true, false);
  };

  Base.prototype.remove_component = function(child) {
    if (!child.pid) {
      return;
    }
    if (_array_rxp.test(child.pid)) {
      if (this["" + child.pid.slice(0, -2)]) {
        delete this["" + child.pid.slice(0, -2)];
      }
    } else {
      delete this[child.pid];
    }
    return this.__components__.splice(this.__components__.indexOf(child), 1);
  };

  Base.prototype.remove_children = function() {
    var child, list, _i, _len;
    list = this.__components__.slice();
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      child = list[_i];
      this.remove_component(child);
      child.remove();
    }
    return Base.__super__.remove_children.apply(this, arguments);
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
  if (component == null) {
    return;
  }
  if (nod instanceof component) {
    return nod;
  } else {
    return new component(nod.node, host, pi._gather_options(nod));
  }
};

pi.piecify = function(nod, host) {
  return pi.init_component(nod, host || nod.parent('.pi'));
};

pi.event = new pi.EventDispatcher();

pi.find = function(pid_path, from) {
  return utils.get_path(pi.app.view, pid_path);
};

utils.extend(Nod.prototype, {
  piecify: function(host) {
    return pi.piecify(this, host);
  },
  pi_call: function(target, action) {
    if (!this._pi_call || this._pi_action !== action) {
      this._pi_action = action;
      this._pi_call = pi.Compiler.str_to_fun(action, target);
    }
    return this._pi_call.call(null);
  }
});

Nod.root.ready(function() {
  return Nod.root.listen('a', 'click', function(e) {
    if (e.target.attr("href")[0] === "@") {
      e.cancel();
      utils.debug("handle pi click: " + (e.target.attr("href")));
      e.target.pi_call(e.target, e.target.attr("href"));
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



},{"../core":45,"./compiler":10}],18:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./pieces');

utils = pi.utils;

pi.PopupContainer = (function(_super) {
  __extends(PopupContainer, _super);

  function PopupContainer() {
    return PopupContainer.__super__.constructor.apply(this, arguments);
  }

  PopupContainer.prototype.postinitialize = function() {
    PopupContainer.__super__.postinitialize.apply(this, arguments);
    this.__overlays__ = [];
    this.__containers__ = [];
    this.__popups__ = [];
    this.z = this.options.z || 300;
    this.show_delay = this.options.show_delay != null ? this.options.show_delay : 200;
    this.hide_delay = this.options.hide_delay != null ? this.options.hide_delay : 500;
    return this.listen('.pi-overlay', 'click', (function(_this) {
      return function(e) {
        return _this.handle_close();
      };
    })(this));
  };

  PopupContainer.prototype.add_overlay = function() {
    this.overlay = pi.Nod.create('div').piecify();
    this.overlay.addClass('pi-overlay');
    this.overlay.hide();
    this.overlay.style("z-index", ++this.z);
    this.__overlays__.push(this.overlay);
    this.append(this.overlay);
    return this.overlay;
  };

  PopupContainer.prototype.add_container = function() {
    this.cont = pi.Nod.create('div').piecify();
    this.cont.addClass('pi-popup-container');
    this.overlay.style("z-index", ++this.z);
    this.__containers__.push(this.cont);
    this.append(this.cont);
    return this.cont;
  };

  PopupContainer.prototype.open = function(target, options) {
    var _target_parent;
    this.target = target;
    if (options == null) {
      options = {};
    }
    if (this.overlay != null) {
      this.overlay.disable();
    }
    if (this.cont != null) {
      this.cont.disable();
    }
    this.add_overlay();
    this.add_container();
    _target_parent = this.target.parent();
    this.target.__parent__ = _target_parent;
    this.target.__popup_options__ = options;
    this.target.style("z-index", ++this.z);
    this.target.addClass('is-popup');
    this.target.hide();
    this.cont.append(this.target);
    this.setup_target(this.target);
    this.show();
    utils.after(this.show_delay, (function(_this) {
      return function() {
        _this.overlay.show();
        _this.target.show();
        if (!_this.opened) {
          _this.opened = true;
          return _this.trigger('opened', true);
        }
      };
    })(this));
    return this.__popups__.push(this.target);
  };

  PopupContainer.prototype.setup_target = function(target) {
    var options;
    options = target.__popup_options__;
    if (options.close === false) {
      return this.addClass('no-close');
    } else {
      return this.removeClass('no-close');
    }
  };

  PopupContainer.prototype.handle_close = function() {
    var options, _ref;
    if (!(options = (_ref = this.target) != null ? _ref.__popup_options__ : void 0)) {
      return;
    }
    if (options.close === false) {
      return;
    }
    if (typeof options.close === 'function') {
      if (options.close.call(null) === false) {
        return;
      }
    }
    this.close();
  };

  PopupContainer.prototype.close = function() {
    if (this._closing) {
      return false;
    }
    this._closing = true;
    this.target.hide();
    this.overlay.hide();
    if (this.__overlays__.length === 1) {
      this.opened = false;
      this.trigger('opened', false);
    }
    return new Promise((function(_this) {
      return function(resolve) {
        return utils.after(_this.hide_delay, function() {
          _this.target.removeClass('is-popup');
          if (_this.target.__parent__ != null) {
            _this.target.__parent__.append(_this.target);
            delete _this.target.__parent__;
            delete _this.target.__popup_options__;
          } else {
            _this.target.remove();
          }
          _this.__popups__.pop();
          _this.__containers__.pop().remove();
          _this.__overlays__.pop().remove();
          _this.z -= 3;
          if (_this.__overlays__.length) {
            _this.cont = _this.__containers__[_this.__containers__.length - 1].enable();
            _this.overlay = _this.__overlays__[_this.__overlays__.length - 1].enable();
            _this.target = _this.__popups__[_this.__popups__.length - 1];
            _this.setup_target(_this.target);
          } else {
            _this.hide();
          }
          _this._closing = false;
          return resolve();
        });
      };
    })(this));
  };

  return PopupContainer;

})(pi.Base);

pi.Guesser.rules_for('popup_container', ['pi-popup']);



},{"../core":45,"./pieces":17}],19:[function(require,module,exports){
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
    return this._sid = utils.after(200, (function(_this) {
      return function() {
        _this.style({
          width: 0
        });
        return _this.hide();
      };
    })(this));
  };

  ProgressBar.prototype.dispose = function() {
    this._sid && clearTimeout(this._sid);
    return ProgressBar.__super__.dispose.apply(this, arguments);
  };

  return ProgressBar;

})(pi.Base);

pi.Guesser.rules_for('progress_bar', ['pi-progressbar']);



},{"../core":45,"./pieces":17}],20:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

require('./events/input_events');

require('./base/list');

utils = pi.utils;

pi.RadioGroup = (function(_super) {
  __extends(RadioGroup, _super);

  function RadioGroup() {
    return RadioGroup.__super__.constructor.apply(this, arguments);
  }

  RadioGroup.include(pi.List);

  RadioGroup.include_plugins(pi.List.Selectable);

  RadioGroup.prototype.postinitialize = function() {
    pi.List.prototype.postinitialize.call(this);
    this.selectable.type('radio');
    this.clear_selection(true);
    this.input = this.find('input');
    this.value(this.input.value());
    return this.on('selected', (function(_this) {
      return function(e) {
        e.cancel();
        _this.input.value(e.data[0].record.value);
        return _this.trigger(pi.InputEvent.Change, _this.value());
      };
    })(this));
  };

  RadioGroup.prototype.value = function(val) {
    var ref;
    if (val != null) {
      val = utils.serialize(val);
      ref = this.where({
        record: {
          value: val
        }
      });
      if (ref.length) {
        return this.select_item(ref[0], true);
      }
    } else {
      return this.input.value();
    }
  };

  RadioGroup.prototype.clear = function(silent) {
    if (silent == null) {
      silent = false;
    }
    this.clear_selection(true);
    this.input.value('');
    if (!silent) {
      return this.trigger(pi.InputEvent.Clear);
    }
  };

  return RadioGroup;

})(pi.BaseInput);

pi.Guesser.rules_for('radio_group', ['pi-radio-group']);



},{"../core":45,"./base/base_input":3,"./base/list":6,"./events/input_events":12}],21:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../../core');

utils = pi.utils;

pi.Renderers = {};

pi.Renderers.Base = (function() {
  function Base() {}

  Base.prototype.render = function(nod, piecified) {
    if (!(nod instanceof pi.Nod)) {
      return;
    }
    return this._render(nod, nod.data(), piecified);
  };

  Base.prototype._render = function(nod, data, piecified) {
    if (piecified == null) {
      piecified = true;
    }
    if (!(nod instanceof pi.Base)) {
      if (piecified) {
        nod = nod.piecify();
      }
    }
    nod.record = data;
    return nod;
  };

  return Base;

})();



},{"../../core":45}],22:[function(require,module,exports){
'use strict';
require('./base');

require('./jst');

require('./mustache');



},{"./base":21,"./jst":23,"./mustache":24}],23:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('./base');

utils = pi.utils;

pi.Renderers.Jst = (function(_super) {
  __extends(Jst, _super);

  function Jst(template) {
    this.templater = JST[template];
  }

  Jst.prototype.render = function(data, piecified) {
    var nod;
    if (data instanceof pi.Nod) {
      return Jst.__super__.render.apply(this, arguments);
    } else {
      nod = pi.Nod.create(this.templater(data));
      return this._render(nod, data, piecified);
    }
  };

  return Jst;

})(pi.Renderers.Base);



},{"../../core":45,"./base":21}],24:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('./base');

utils = pi.utils;

pi.Renderers.Mustache = (function(_super) {
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

  Mustache.prototype.render = function(data, piecified) {
    var nod;
    if (data instanceof pi.Nod) {
      return Mustache.__super__.render.apply(this, arguments);
    } else {
      nod = pi.Nod.create(window.Mustache.render(this.template, data));
      return this._render(nod, data, piecified);
    }
  };

  return Mustache;

})(pi.Renderers.Base);



},{"../../core":45,"./base":21}],25:[function(require,module,exports){
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



},{"../core":45,"./base/textinput":7}],26:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/base_input');

require('./events/input_events');

utils = pi.utils;

pi.SelectInput = (function(_super) {
  __extends(SelectInput, _super);

  function SelectInput() {
    return SelectInput.__super__.constructor.apply(this, arguments);
  }

  SelectInput.requires('dropdown', 'placeholder');

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
        _this.placeholder.text(e.data[0].text());
        _this.trigger(pi.InputEvent.Change, e.data[0].record.value);
        return _this.blur();
      };
    })(this));
    this.on('focus', (function(_this) {
      return function() {
        return _this.dropdown.show();
      };
    })(this));
    this.on('blur', (function(_this) {
      return function() {
        return _this.dropdown.hide();
      };
    })(this));
    if (this.options.default_value != null) {
      return this.value(this.options.default_value);
    } else if (this.placeholder.text() === '') {
      return this.placeholder.text(this.placeholder.options.placeholder);
    }
  };

  SelectInput.prototype.value = function(val) {
    var item, ref;
    if (val != null) {
      SelectInput.__super__.value.apply(this, arguments);
      this.dropdown.clear_selection(true);
      ref = this.dropdown.where({
        record: {
          value: val
        }
      });
      if (ref.length) {
        item = ref[0];
        this.dropdown.select_item(item);
        this.placeholder.text(item.text());
      }
      return val;
    } else {
      return SelectInput.__super__.value.apply(this, arguments);
    }
  };

  SelectInput.prototype.clear = function() {
    this.dropdown.clear_selection(true);
    if (this.options.default_value != null) {
      return this.value(this.options.default_value);
    } else {
      this.placeholder.text(this.placeholder.options.placeholder);
      return SelectInput.__super__.clear.apply(this, arguments);
    }
  };

  return SelectInput;

})(pi.BaseInput);

pi.Guesser.rules_for('select_input', ['pi-select-field'], null);



},{"../core":45,"./base/base_input":3,"./events/input_events":12}],27:[function(require,module,exports){
'use strict';
var pi, utils, _sort_param,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./pieces');

utils = pi.utils;

_sort_param = function(name, order) {
  var ref;
  ref = {};
  ref[name] = order;
  return ref;
};

pi.Sorters = (function(_super) {
  __extends(Sorters, _super);

  function Sorters() {
    return Sorters.__super__.constructor.apply(this, arguments);
  }

  Sorters.requires('sorters');

  Sorters.prototype.postinitialize = function() {
    var sorter, _i, _len, _ref;
    Sorters.__super__.postinitialize.apply(this, arguments);
    this.sorters_by_name = {};
    this._value = [];
    _ref = this.sorters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sorter = _ref[_i];
      this.sorters_by_name[sorter.options.name] = sorter;
      if (sorter.hasClass('is-desc')) {
        this.update_sorter(sorter, 'desc');
      } else if (sorter.hasClass('is-asc')) {
        this.update_sorter(sorter, 'asc');
      }
    }
    return this.on('click', this.sorter_click(), this, (function(_this) {
      return function(e) {
        return e.target.host === _this;
      };
    })(this));
  };

  Sorters.prototype.sorter_click = function() {
    return this._sorter_click || (this._sorter_click = (function(_this) {
      return function(e) {
        var _old;
        _old = e.target.__state__;
        if (!_this.options.multiple) {
          _this.clear();
        }
        _this.toggle_state(e.target, _old);
        return _this.trigger('update', _this.value());
      };
    })(this));
  };

  Sorters.prototype.toggle_state = function(sorter, prev_state) {
    switch (false) {
      case prev_state !== 'asc':
        this.update_sorter(sorter, 'desc');
        break;
      case !(prev_state === 'desc' && this.options.multiple):
        this.remove_sorter(sorter);
        break;
      default:
        this.update_sorter(sorter, 'asc');
    }
  };

  Sorters.prototype.update_sorter = function(sorter, new_state) {
    var key, val, _;
    sorter.__state__ = new_state;
    sorter.removeClass('is-desc', 'is-asc');
    sorter.addClass("is-" + new_state);
    if ((val = this._find_param(sorter.options.name))) {
      for (key in val) {
        if (!__hasProp.call(val, key)) continue;
        _ = val[key];
        val[key] = sorter.__state__;
      }
    } else {
      this._value.push(_sort_param(sorter.options.name, sorter.__state__));
    }
  };

  Sorters.prototype.remove_sorter = function(sorter) {
    var val;
    if ((val = this._find_param(sorter.options.name))) {
      this._value.splice(this._value.indexOf(val), 1);
      sorter.__state__ = '';
      sorter.removeClass('is-desc', 'is-asc');
    }
  };

  Sorters.prototype._find_param = function(name) {
    var key, val, _, _i, _len, _ref;
    _ref = this._value;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      val = _ref[_i];
      for (key in val) {
        if (!__hasProp.call(val, key)) continue;
        _ = val[key];
        if (key === name) {
          return val;
        }
      }
    }
  };

  Sorters.prototype.value = function() {
    return this._value;
  };

  Sorters.prototype.set = function(sort_params) {
    var name, param, val, _i, _len;
    this.clear();
    for (_i = 0, _len = sort_params.length; _i < _len; _i++) {
      param = sort_params[_i];
      for (name in param) {
        if (!__hasProp.call(param, name)) continue;
        val = param[name];
        this.update_sorter(this.sorters_by_name[name], val);
      }
    }
  };

  Sorters.prototype.clear = function() {
    var sorter, _i, _len, _ref;
    this._value.length = 0;
    _ref = this.sorters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sorter = _ref[_i];
      sorter.__state__ = '';
      sorter.removeClass('is-desc', 'is-asc');
    }
    return this;
  };

  return Sorters;

})(pi.Base);

pi.Guesser.rules_for('sorters', ['pi-sorters'], null);



},{"../core":45,"./pieces":17}],28:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base/textinput');

require('./events/input_events');

utils = pi.utils;

pi.Stepper = (function(_super) {
  __extends(Stepper, _super);

  function Stepper() {
    return Stepper.__super__.constructor.apply(this, arguments);
  }

  Stepper.prototype.postinitialize = function() {
    Stepper.__super__.postinitialize.apply(this, arguments);
    this._prefix = this.options.prefix != null ? this.options.prefix : "";
    this._suffix = this.options.suffix != null ? this.options.suffix : "";
    this._step = parseFloat(this.options.step || 1);
    if (this.options.min != null) {
      this._min = parseFloat(this.options.min);
    }
    if (this.options.max != null) {
      this._max = parseFloat(this.options.max);
    }
    this.value(this.input.value());
    return this.listen('.step', 'click', (function(_this) {
      return function(e) {
        if (e.target.hasClass('step-up')) {
          _this.incr();
        } else {
          _this.decr();
        }
        _this.trigger(pi.InputEvent.Change, _this.value());
        return e.cancel();
      };
    })(this));
  };

  Stepper.prototype.value = function(val) {
    if (val != null) {
      if ((this._max != null) && (val | 0) > this._max) {
        val = this._max;
      } else if (this._min && (val | 0) < this._min) {
        val = this._min;
      }
      return Stepper.__super__.value.call(this, this._prepare_value(val));
    } else {
      return this._read_value();
    }
  };

  Stepper.prototype.incr = function() {
    return this.value((this._read_value() | 0) + this._step);
  };

  Stepper.prototype.decr = function() {
    return this.value((this._read_value() | 0) - this._step);
  };

  Stepper.prototype._prepare_value = function(val) {
    if (val === null) {
      return null;
    }
    return "" + this._prefix + val + this._suffix;
  };

  Stepper.prototype._read_value = function() {
    var val;
    val = this.input.node.value;
    return val.replace(this._prefix, '').replace(this._suffix, '');
  };

  return Stepper;

})(pi.TextInput);

pi.Guesser.rules_for('stepper', ['pi-stepper']);



},{"../core":45,"./base/textinput":7,"./events/input_events":12}],29:[function(require,module,exports){
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



},{"../core":45,"./pieces":17}],30:[function(require,module,exports){
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
    return TextArea.__super__.postinitialize.apply(this, arguments);
  };

  return TextArea;

})(pi.TextInput);

pi.Guesser.rules_for('text_area', ['pi-textarea'], ['textarea']);



},{"../core":45,"./base/textinput":7}],31:[function(require,module,exports){
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



},{"../core":45,"../plugins/base/selectable":62,"./base/button":4}],32:[function(require,module,exports){
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

  Base.prototype.load = function(context_data) {
    if (!this._initialized) {
      this.initialize();
    }
    this.view.loaded(context_data.data);
  };

  Base.prototype.reload = function(context_data) {
    this.view.reloaded(context_data.data);
  };

  Base.prototype.switched = function() {
    this.view.switched();
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



},{"../core":45}],33:[function(require,module,exports){
'use strict';
require('./base');

require('./page');

require('./modules');

require('./list.controller');



},{"./base":32,"./list.controller":34,"./modules":35,"./page":38}],34:[function(require,module,exports){
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
    this.prototype._parse_response = function(data) {
      return data[resource.resources_name];
    };
    return this.has_resource(resource);
  };

  ListController.prototype.id = 'list_base';

  ListController.prototype.default_scope = {};

  ListController.prototype.initialize = function() {
    this.scope().set(this.default_scope);
    return ListController.__super__.initialize.apply(this, arguments);
  };

  ListController.prototype.query = function(params) {
    if (params == null) {
      params = {};
    }
    params = utils.merge(this.scope().params, params);
    this.view.loading(true);
    return this.resources.query(params).then(((function(_this) {
      return function(response) {
        _this.view.loading(false);
        if ((response != null ? response.message : void 0) != null) {
          _this.view.success(response.message);
        }
        return response;
      };
    })(this)), ((function(_this) {
      return function(error) {
        _this.view.loading(false);
        _this.view.error(error.message);
        throw error;
      };
    })(this)));
  };

  ListController.prototype.index = function(params) {
    this.scope().set(params);
    return this.query().then((function(_this) {
      return function(data) {
        _this.view.load(_this._parse_response(data));
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
      return this.query().then((function(_this) {
        return function(data) {
          _this.view.reload(_this._parse_response(data));
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
      return this.query().then((function(_this) {
        return function(data) {
          _this.view.reload(_this._parse_response(data));
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
      return this.query().then((function(_this) {
        return function(data) {
          _this.view.reload(_this._parse_response(data));
          _this.view.filtered(params);
          return data;
        };
      })(this));
    }
  };

  return ListController;

})(pi.controllers.Base);



},{"../core":45,"./base":32,"./modules/scoped":37,"./page":38}],35:[function(require,module,exports){
'use strict';
require('./scoped');

require('./paginated');



},{"./paginated":36,"./scoped":37}],36:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../../core');

require('../base');

utils = pi.utils;

pi.controllers.Paginated = (function() {
  function Paginated() {}

  Paginated.included = function(base) {
    var _query;
    _query = base.prototype.query;
    base.prototype.query = function(params) {
      if (params == null) {
        params = {};
      }
      if (params.page == null) {
        params.page = this._page = 1;
      }
      params.per_page = this.per_page;
      return _query.call(this, params).then((function(_this) {
        return function(data) {
          _this.page_resolver(data);
          return data;
        };
      })(this));
    };
    base.prototype.scope_blacklist.push('page', 'per_page');
  };

  Paginated.prototype.page_resolver = function(data) {
    var list;
    if (((list = this._parse_response(data)) != null) && list.length < this.per_page) {
      return this.scope().all_loaded();
    }
  };

  Paginated.prototype.per_page = 40;

  Paginated.prototype.next_page = function() {
    if (this.scope().is_full) {
      return;
    }
    this._page = (this._page || 0) + 1;
    return this.query({
      page: this._page
    }).then((function(_this) {
      return function(data) {
        _this.view.load(_this._parse_response(data));
        return data;
      };
    })(this));
  };

  return Paginated;

})();



},{"../../core":45,"../base":32}],37:[function(require,module,exports){
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

  Scoped.prototype.scope_whitelist = [];

  Scoped.prototype.scope_blacklist = [];

  Scoped.prototype.scope_rules = {};

  Scoped.prototype.scope = function() {
    return this._scope || (this._scope = new Scope(this.scope_whitelist, this.scope_blacklist, this.scope_rules));
  };

  return Scoped;

})();



},{"../../core":45,"../base":32}],38:[function(require,module,exports){
'use strict';
var History, pi, utils,
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

  Page.prototype.wrap_context_data = function(context, data) {
    var res;
    res = {};
    if (context != null) {
      res.context = context.id;
    }
    if ((context != null ? context.data_wrap : void 0) != null) {
      res.data = {};
      res.data[context.data_wrap] = data;
    } else {
      res.data = data;
    }
    return res;
  };

  Page.prototype.switch_context = function(from, to, data, exit) {
    if (data == null) {
      data = {};
    }
    if (exit == null) {
      exit = false;
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
      if (exit) {
        this.context.unload();
      } else {
        this.context.switched();
      }
    }
    data = this.wrap_context_data(this.context, data);
    if ((from != null) && !exit) {
      this._history.push(from);
    }
    this.context = this._contexts[to];
    this.context_id = to;
    if (exit) {
      this.context.reload(data);
    } else {
      this.context.load(data);
    }
    return true;
  };

  Page.prototype.switch_to = function(to, data) {
    return this.switch_context(this.context_id, to, data);
  };

  Page.prototype.switch_back = function(data) {
    if (this.context != null) {
      return this.switch_context(this.context_id, this._history.pop(), data, true);
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

pi.Compiler.modifiers.push(function(str) {
  if (str.slice(0, 2) === '@@') {
    str = "@app.page.context." + str.slice(2);
  }
  return str;
});



},{"../core":45,"../core/utils/history":50,"./base":32}],39:[function(require,module,exports){
'use strict';
var pi, utils,
  __slice = [].slice;

pi = require('./pi');

require('./utils');

utils = pi.utils;

pi.Core = (function() {
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

  Core.included = function() {
    return true;
  };

  Core.extended = function() {
    return true;
  };

  Core.register_callback = function(method, options) {
    var callback_name, _fn, _i, _len, _ref, _when;
    if (options == null) {
      options = {};
    }
    callback_name = options.as || method;
    _ref = ["before", "after"];
    _fn = (function(_this) {
      return function(_when) {
        return _this["" + _when + "_" + callback_name] = function(callback) {
          var _base, _name;
          if (this.prototype["_" + _when + "_" + callback_name] && !this.prototype.hasOwnProperty("_" + _when + "_" + callback_name)) {
            this.prototype["_" + _when + "_" + callback_name] = this.prototype["_" + _when + "_" + callback_name].slice();
          }
          return ((_base = this.prototype)[_name = "_" + _when + "_" + callback_name] || (_base[_name] = [])).push(callback);
        };
      };
    })(this);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _when = _ref[_i];
      _fn(_when);
    }
    this.prototype["__" + method] = function() {
      var args, res;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.run_callbacks("before_" + callback_name, args);
      res = this.constructor.prototype[method].apply(this, args);
      this.run_callbacks("after_" + callback_name, args);
      return res;
    };
    return (this.callbacked || (this.callbacked = [])).push(method);
  };

  function Core() {
    var method, _fn, _i, _len, _ref;
    _ref = this.constructor.callbacked || [];
    _fn = (function(_this) {
      return function(method) {
        return _this[method] = _this["__" + method];
      };
    })(this);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      method = _ref[_i];
      _fn(method);
    }
  }

  Core.prototype.run_callbacks = function(type, args) {
    var callback, _i, _len, _ref, _results;
    _ref = this["_" + type] || [];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback.apply(this, args));
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



},{"./pi":47,"./utils":51}],40:[function(require,module,exports){
'use strict';
var pi;

pi = require('../pi');

require('./nod_events');

pi.NodEvent.register_alias('mousewheel', 'DOMMouseScroll');



},{"../pi":47,"./nod_events":43}],41:[function(require,module,exports){
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
    this.captured = false;
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
    EventListener.__super__.constructor.apply(this, arguments);
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
    if (this.handler.call(this.context, event) !== false) {
      event.captured = true;
    }
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
    EventDispatcher.__super__.constructor.apply(this, arguments);
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
    }
    if (event.captured !== true) {
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



},{"../core":39,"../pi":47,"../utils/index":51}],42:[function(require,module,exports){
'use strict';
require('./events');

require('./nod_events');

require('./aliases');



},{"./aliases":40,"./events":41,"./nod_events":43}],43:[function(require,module,exports){
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
    this.type = this.constructor.is_aliased(event.type) ? this.constructor.reversed_aliases[event.type] : event.type;
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
      if (node === parent) {
        return false;
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
    return this.on(event, callback, context, _selector(selector, this.node));
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



},{"../pi":47,"../utils":51,"./events":41}],44:[function(require,module,exports){
'use strict';
var pi, utils,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pi = require('../pi');

utils = pi.utils;

pi.Former = (function() {
  function Former(nod, options) {
    this.nod = nod;
    this.options = options != null ? options : {};
    if (this.options.rails === true) {
      this.options.name_transform = this._rails_name_transform;
    }
    if (this.options.serialize === true) {
      this.options.parse_value = utils.serialize;
    }
  }

  Former.parse = function(nod, options) {
    return (new pi.Former(nod, options)).parse();
  };

  Former.fill = function(nod, options) {
    return (new pi.Former(nod, options)).fill();
  };

  Former.clear = function(nod, options) {
    return (new pi.Former(nod, options)).clear();
  };

  Former.prototype.parse = function() {
    return this.process_name_values(this.collect_name_values());
  };

  Former.prototype.fill = function(data) {
    return this.traverse_nodes(this.nod, (function(_this) {
      return function(nod) {
        return _this._fill_nod(nod, data);
      };
    })(this));
  };

  Former.prototype.clear = function() {
    return this.traverse_nodes(this.nod, (function(_this) {
      return function(nod) {
        return _this._clear_nod(nod);
      };
    })(this));
  };

  Former.prototype.process_name_values = function(name_values) {
    var item, _arrays, _fn, _i, _len, _result;
    _result = {};
    _arrays = {};
    _fn = (function(_this) {
      return function(item) {
        var i, len, name, name_part, value, _arr_fullname, _current, _j, _len1, _name_parts, _results;
        name = item.name, value = item.value;
        if (_this.options.skip_empty && (value === '' || value === null)) {
          return;
        }
        _arr_fullname = '';
        _current = _result;
        name = _this.transform_name(name, false);
        value = _this.transform_value(value);
        _name_parts = name.split(".");
        len = _name_parts.length;
        _results = [];
        for (i = _j = 0, _len1 = _name_parts.length; _j < _len1; i = ++_j) {
          name_part = _name_parts[i];
          _results.push((function(name_part) {
            var _arr_len, _arr_name, _array_item, _next_field;
            if (name_part.indexOf('[]') > -1) {
              _arr_name = name_part.substr(0, name_part.indexOf('['));
              _arr_fullname += _arr_name;
              _current[_arr_name] || (_current[_arr_name] = []);
              if (i === (len - 1)) {
                return _current[_arr_name].push(value);
              } else {
                _next_field = _name_parts[i + 1];
                _arrays[_arr_fullname] || (_arrays[_arr_fullname] = []);
                _arr_len = _arrays[_arr_fullname].length;
                if (_current[_arr_name].length > 0) {
                  _array_item = _current[_arr_name][_current[_arr_name].length - 1];
                }
                if (!_arr_len || ((__indexOf.call(_arrays[_arr_fullname], _next_field) >= 0) && !(_next_field.indexOf('[]') > -1 || !(_array_item[_next_field] && (i + 1 === len - 1))))) {
                  _array_item = {};
                  _current[_arr_name].push(_array_item);
                  _arrays[_arr_fullname] = [];
                }
                _arrays[_arr_fullname].push(_next_field);
                return _current = _array_item;
              }
            } else {
              _arr_fullname += name_part;
              if (i < (len - 1)) {
                _current[name_part] || (_current[name_part] = {});
                return _current = _current[name_part];
              } else {
                return _current[name_part] = value;
              }
            }
          })(name_part));
        }
        return _results;
      };
    })(this);
    for (_i = 0, _len = name_values.length; _i < _len; _i++) {
      item = name_values[_i];
      _fn(item);
    }
    return _result;
  };

  Former.prototype.collect_name_values = function() {
    return this.traverse_nodes(this.nod, (function(_this) {
      return function(nod) {
        return _this._parse_nod(nod);
      };
    })(this));
  };

  Former.prototype.traverse_nodes = function(nod, callback) {
    var current, result;
    result = this._to_array(callback(nod));
    current = nod.firstChild;
    while ((current != null)) {
      if (current.nodeType === 1) {
        result = result.concat(this.traverse_nodes(current, callback));
      }
      current = current.nextSibling;
    }
    return result;
  };

  Former.prototype.transform_name = function(name, prefix) {
    if (prefix == null) {
      prefix = true;
    }
    if (this.options.fill_prefix && prefix) {
      name = name.replace(this.options.fill_prefix, '');
    }
    if (this.options.name_transform != null) {
      name = this.options.name_transform(name);
    }
    return name;
  };

  Former.prototype.transform_value = function(val) {
    if (this.options.parse_value != null) {
      return this.options.parse_value(val);
    }
    return val;
  };

  Former.prototype._to_array = function(val) {
    if (val == null) {
      return [];
    } else {
      return utils.to_a(val);
    }
  };

  Former.prototype._parse_nod = function(nod) {
    var val;
    if (this.options.disabled === false && nod.disabled) {
      return;
    }
    if (!/(input|select|textarea)/i.test(nod.nodeName)) {
      return;
    }
    if (!nod.name) {
      return;
    }
    val = this._parse_nod_value(nod);
    if (val == null) {
      return;
    }
    return {
      name: nod.name,
      value: val
    };
  };

  Former.prototype._fill_nod = function(nod, data) {
    var type, value;
    if (!/(input|select|textarea)/i.test(nod.nodeName)) {
      return;
    }
    value = this._nod_data_value(nod.name, data);
    if (value == null) {
      return;
    }
    if (nod.nodeName.toLowerCase() === 'select') {
      this._fill_select(nod, value);
    } else {
      if (typeof value === 'object') {
        return;
      }
      type = nod.type.toLowerCase();
      switch (false) {
        case !(/(radio|checkbox)/.test(type) && value):
          nod.checked = true;
          break;
        case !(/(radio|checkbox)/.test(type) && !value):
          nod.checked = false;
          break;
        default:
          nod.value = value;
      }
    }
  };

  Former.prototype._fill_select = function(nod, value) {
    var option, _i, _len, _ref, _results;
    value = value instanceof Array ? value : [value];
    _ref = nod.getElementsByTagName("option");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      _results.push((function(option) {
        var _ref1;
        return option.selected = (_ref1 = option.value, __indexOf.call(value, _ref1) >= 0);
      })(option));
    }
    return _results;
  };

  Former.prototype._clear_nod = function(nod) {
    var type;
    if (!/(input|select|textarea)/i.test(nod.nodeName)) {
      return;
    }
    if (nod.nodeName.toLowerCase() === 'select') {
      this._fill_select(nod, []);
    } else {
      type = nod.type.toLowerCase();
      switch (false) {
        case !/(radio|checkbox)/.test(type):
          nod.checked = false;
          break;
        case !(type === 'hidden' && !this.options.clear_hidden):
          true;
          break;
        default:
          nod.value = '';
      }
    }
  };

  Former.prototype._nod_data_value = function(name, data) {
    var key, _i, _len, _ref;
    if (!name) {
      return;
    }
    name = this.transform_name(name);
    if (name.indexOf('[]') > -1) {
      return;
    }
    _ref = name.split(".");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      data = data[key];
      if (data == null) {
        break;
      }
    }
    return data;
  };

  Former.prototype._parse_nod_value = function(nod) {
    var type;
    if (nod.nodeName.toLowerCase() === 'select') {
      return this._parse_select_value(nod);
    } else {
      type = nod.type.toLowerCase();
      switch (false) {
        case !(/(radio|checkbox)/.test(type) && nod.checked):
          return nod.value;
        case !(/(radio|checkbox)/.test(type) && !nod.checked):
          return null;
        case !/(button|reset|submit|image)/.test(type):
          return null;
        case !/(file)/.test(type):
          return this._parse_file_value(nod);
        default:
          return nod.value;
      }
    }
  };

  Former.prototype._parse_file_value = function(nod) {
    var _ref;
    if (!((_ref = nod.files) != null ? _ref.length : void 0)) {
      return;
    }
    if (nod.multiple) {
      return nod.files;
    } else {
      return nod.files[0];
    }
  };

  Former.prototype._parse_select_value = function(nod) {
    var multiple, option, _i, _len, _ref, _results;
    multiple = nod.multiple;
    if (!multiple) {
      return nod.value;
    }
    _ref = nod.getElementsByTagName("option");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      if (option.selected) {
        _results.push(option.value);
      }
    }
    return _results;
  };

  Former.prototype._rails_name_transform = function(name) {
    return name.replace(/\[([^\]])/ig, ".$1").replace(/([^\[])([\]]+)/ig, "$1");
  };

  return Former;

})();



},{"../pi":47}],45:[function(require,module,exports){
'use strict';
var pi;

pi = require('./pi');

require('./nod');

require('./former/former');

module.exports = pi;



},{"./former/former":44,"./nod":46,"./pi":47}],46:[function(require,module,exports){
'use strict';
var d, info, klasses, pi, utils, version, versions, _caf, _data_reg, _dataset, _fn, _fn1, _fragment, _from_dataCase, _geometry_styles, _i, _j, _len, _len1, _node, _prop_hash, _raf, _ref, _ref1,
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
      this._with_raf(name, (function(_this) {
        return function() {
          return _this.node.style[name] = Math.round(val) + "px";
        };
      })(this));
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

_raf = window.requestAnimationFrame != null ? window.requestAnimationFrame : function(callback) {
  return callback();
};

_caf = window.cancelAnimationFrame != null ? window.cancelAnimationFrame : function() {
  return true;
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
    temp = _fragment(html);
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
    var _ref;
    if ((_ref = this.node.parentNode) != null) {
      _ref.removeChild(this.node);
    }
    return this;
  };

  Nod.prototype.detach_children = function() {
    while (this.node.children.length) {
      this.node.removeChild(this.node.children[0]);
    }
    return this;
  };

  Nod.prototype.remove_children = function() {
    while (this.node.firstChild) {
      if (this.node.firstChild._nod) {
        this.node.firstChild._nod.remove();
      } else {
        this.node.removeChild(this.node.firstChild);
      }
    }
    return this;
  };

  Nod.prototype.remove = function() {
    this.detach();
    this.remove_children();
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

  Nod.prototype.name = function() {
    return this.node.name || this.data('name');
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
      if (klass) {
        this.addClass(klass);
      }
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

  Nod.prototype._with_raf = function(name, fun) {
    if (this["__" + name + "_rid"]) {
      _caf(this["__" + name + "_rid"]);
      delete this["__" + name + "_rid"];
    }
    return this["__" + name + "_rid"] = _raf(fun);
  };

  Nod.prototype.move = function(x, y) {
    return this._with_raf('move', (function(_this) {
      return function() {
        return _this.style({
          left: "" + x + "px",
          top: "" + y + "px"
        });
      };
    })(this));
  };

  Nod.prototype.moveX = function(x) {
    return this.left(x);
  };

  Nod.prototype.moveY = function(y) {
    return this.top(y);
  };

  Nod.prototype.scrollX = function(x) {
    return this._with_raf('scrollX', (function(_this) {
      return function() {
        return _this.node.scrollLeft = x;
      };
    })(this));
  };

  Nod.prototype.scrollY = function(y) {
    return this._with_raf('scrollY', (function(_this) {
      return function() {
        return _this.node.scrollTop = y;
      };
    })(this));
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
  if (val === null) {
    this.node.style[prop] = null;
  } else if (val === void 0) {
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

_ref = ["width", "height"];
_fn = function() {
  var prop;
  prop = "client" + (utils.capitalize(d));
  return pi.Nod.prototype[prop] = function() {
    return this.node[prop];
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  d = _ref[_i];
  _fn();
}

_ref1 = ["top", "left", "width", "height"];
_fn1 = function() {
  var prop;
  prop = "scroll" + (utils.capitalize(d));
  return pi.Nod.prototype[prop] = function() {
    return this.node[prop];
  };
};
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  d = _ref1[_j];
  _fn1();
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

pi.NodWin = (function(_super) {
  __extends(NodWin, _super);

  NodWin.instance = null;

  function NodWin() {
    if (pi.NodWin.instance) {
      throw "NodWin is already defined!";
    }
    pi.NodWin.instance = this;
    this.delegate_to(pi.Nod.root, 'scrollLeft', 'scrollTop', 'scrollWidth', 'scrollHeight');
    NodWin.__super__.constructor.call(this, window);
  }

  NodWin.prototype.scrollY = function(y) {
    var x;
    x = this.scrollLeft();
    return this._with_raf('scrollY', (function(_this) {
      return function() {
        return _this.node.scrollTo(x, y);
      };
    })(this));
  };

  NodWin.prototype.scrollX = function(x) {
    var y;
    y = this.scrollTop();
    return this._with_raf('scrollX', (function(_this) {
      return function() {
        return _this.node.scrollTo(x, y);
      };
    })(this));
  };

  NodWin.prototype.width = function() {
    return this.node.innerWidth;
  };

  NodWin.prototype.height = function() {
    return this.node.innerHeight;
  };

  NodWin.prototype.x = function() {
    return 0;
  };

  NodWin.prototype.y = function() {
    return 0;
  };

  return NodWin;

})(pi.Nod);

pi.Nod.win = new pi.NodWin();

pi.Nod.body = new pi.Nod(document.body);

pi.$ = function(q) {
  if (utils.is_html(q)) {
    return pi.Nod.create(q);
  } else {
    return pi.Nod.root.find(q);
  }
};

pi["export"](pi.$, '$');

info = utils.browser.info();

klasses = [];

if (info.msie === true) {
  klasses.push('ie');
  versions = info.version.split(".");
  version = versions.length ? versions[0] : version;
  klasses.push("ie" + version);
}

if (info.mobile === true) {
  klasses.push('mobile');
}

if (info.tablet === true) {
  klasses.push('tablet');
}

if (klasses.length) {
  pi.Nod.root.addClass.apply(pi.Nod.root, klasses);
}

pi.Nod.root.initialize();



},{"./events":42,"./pi":47,"./utils":51}],47:[function(require,module,exports){
'use strict';
var pi;

pi = {};

module.exports = {};



},{}],48:[function(require,module,exports){
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

  utils.digital_rxp = /^[\d\s-\(\)]+$/;

  utils.html_rxp = /^\s*<.+>\s*$/m;

  utils.esc_rxp = /[-[\]{}()*+?.,\\^$|#]/g;

  utils.clickable_rxp = /^(a|button|input|textarea)$/i;

  utils.input_rxp = /^(input|select|textarea)$/i;

  utils.trim_rxp = /^\s*(.*[^\s])\s*$/m;

  utils.notsnake_rxp = /((?:^[^A-Z]|[A-Z])[^A-Z]*)/g;

  utils.str_rxp = /(^'|'$)/g;

  utils.uid = function() {
    return "" + (++this.uniq_id);
  };

  utils.escapeRegexp = function(str) {
    return str.replace(this.esc_rxp, "\\$&");
  };

  utils.trim = function(str) {
    return str.replace(this.trim_rxp, "$1");
  };

  utils.is_digital = function(str) {
    return this.digital_rxp.test(str);
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

  utils.is_input = function(node) {
    return this.input_rxp.test(node.nodeName);
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
        case val !== '':
          return '';
        case !(isNaN(Number(val)) && typeof val === 'string'):
          return (val + "").replace(this.str_rxp, '');
        case !isNaN(Number(val)):
          return val;
        default:
          return Number(val);
      }
    }).call(this);
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

  utils.set_path = function(obj, path, val) {
    var key, parts, res;
    parts = path.split(".");
    res = obj;
    while (parts.length > 1) {
      key = parts.shift();
      if (res[key] == null) {
        res[key] = {};
      }
      res = res[key];
    }
    return res[parts[0]] = val;
  };

  utils.get_class_path = function(pckg, path) {
    path = path.split('.').map((function(_this) {
      return function(p) {
        return _this.camelCase(p);
      };
    })(this)).join('.');
    return this.get_path(pckg, path);
  };

  utils.wrap = function(key, obj) {
    var data;
    data = {};
    data[key] = obj;
    return data;
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

  utils.extract = function(data, source, param) {
    var el, key, p, vals, _fn, _i, _j, _len, _len1;
    if (source == null) {
      return;
    }
    if (Array.isArray(source)) {
      _fn = (function(_this) {
        return function(el) {
          var el_data;
          el_data = {};
          _this.extract(el_data, el, param);
          return data.push(el_data);
        };
      })(this);
      for (_i = 0, _len = source.length; _i < _len; _i++) {
        el = source[_i];
        _fn(el);
      }
      data;
    } else {
      if (typeof param === 'string') {
        if (source[param] != null) {
          data[param] = source[param];
        }
      } else if (Array.isArray(param)) {
        for (_j = 0, _len1 = param.length; _j < _len1; _j++) {
          p = param[_j];
          this.extract(data, source, p);
        }
      } else {
        for (key in param) {
          if (!__hasProp.call(param, key)) continue;
          vals = param[key];
          if (source[key] == null) {
            return;
          }
          if (Array.isArray(source[key])) {
            data[key] = [];
          } else {
            data[key] = {};
          }
          this.extract(data[key], source[key], vals);
        }
      }
    }
    return data;
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
      (ths || {}).__debounce_id__ = pi.utils.after(period, function() {
        _wait = false;
        if (_buf != null) {
          fun.apply(ths, _buf);
          return _buf = null;
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
    args = pi.utils.to_a(args);
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



},{"../pi":47}],49:[function(require,module,exports){
'use strict';
var pi, utils, _android_version_rxp, _ios_rxp, _ios_version_rxp, _mac_os_version_rxp, _win_version, _win_version_rxp;

pi = require('../pi');

require('./base');

utils = pi.utils;

_mac_os_version_rxp = /\bMac OS X ([\d\._]+)\b/;

_win_version_rxp = /\bWindows NT ([\d\.]+)\b/;

_ios_rxp = /(iphone|ipod|ipad)/i;

_ios_version_rxp = /\bcpu\s*(?:iphone\s+)?os ([\d\.\-_]+)\b/i;

_android_version_rxp = /\bandroid[\s\-]([\d\-\._]+)\b/i;

_win_version = {
  '6.3': '8.1',
  '6.2': '8',
  '6.1': '7',
  '6.0': 'Vista',
  '5.2': 'XP',
  '5.1': 'XP'
};

pi.utils.browser = (function() {
  function browser() {}

  browser.scrollbar_width = function() {
    return this._scrollbar_width || (this._scrollbar_width = (function() {
      var outer, outerStyle, w;
      outer = document.createElement('div');
      outerStyle = outer.style;
      outerStyle.position = 'absolute';
      outerStyle.width = '100px';
      outerStyle.height = '100px';
      outerStyle.overflow = "scroll";
      outerStyle.top = '-9999px';
      document.body.appendChild(outer);
      w = outer.offsetWidth - outer.clientWidth;
      document.body.removeChild(outer);
      return w;
    })());
  };

  browser.info = function() {
    if (!this._info) {
      this._info = window.bowser != null ? this._extend_info(window.bowser) : this._extend_info();
    }
    return this._info;
  };

  browser._extend_info = function(data) {
    if (data == null) {
      data = {};
    }
    data.os = this.os();
    return data;
  };

  browser.os = function() {
    return this._os || (this._os = (function() {
      var matches, res, ua;
      res = {};
      ua = window.navigator.userAgent;
      if (ua.indexOf('Windows') > -1) {
        res.windows = true;
        if (matches = _win_version_rxp.exec(ua)) {
          res.version = _win_version[matches[1]];
        }
      } else if (ua.indexOf('Macintosh') > -1) {
        res.macos = true;
        if (matches = _mac_os_version_rxp.exec(ua)) {
          res.version = matches[1];
        }
      } else if (ua.indexOf('X11') > -1) {
        res.unix = true;
      } else if (matches = _ios_rxp.exec(ua)) {
        res[matches[1]] = true;
        if (matches = _ios_version_rxp.exec(ua)) {
          res.version = matches[1];
        }
      } else if (ua.indexOf('Android') > -1) {
        res.android = true;
        if (matches = _android_version_rxp.exec(ua)) {
          res.version = matches[1];
        }
      } else if (ua.indexOf('Tizen') > -1) {
        res.tizen = true;
      } else if (ua.indexOf('Blackberry') > -1) {
        res.blackberry = true;
      }
      if (res.version) {
        res.version = res.version.replace(/(_|\-)/g, ".");
      }
      return res;
    })());
  };

  return browser;

})();



},{"../pi":47,"./base":48}],50:[function(require,module,exports){
'use strict';
var History;

History = (function() {
  function History() {
    this._storage = [];
    this._position = 0;
  }

  History.prototype.push = function(item) {
    if (this._position < 0) {
      this._storage.splice(this._storage.length + this._position, -this._position);
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



},{}],51:[function(require,module,exports){
'use strict';
require('./base');

require('./time');

require('./logger');

require('./matchers');

require('./browser');



},{"./base":48,"./browser":49,"./logger":52,"./matchers":53,"./time":54}],52:[function(require,module,exports){
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



},{"../pi":47,"./base":48,"./time":54}],53:[function(require,module,exports){
'use strict';
var pi, utils, _key_operand, _operands,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;

pi = require('../pi');

require('./base');

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
  },
  "~": function(val) {
    if (typeof val === 'string') {
      val = new RegExp(utils.escapeRegexp(val));
    }
    return function(value) {
      return val.test(value);
    };
  }
};

_key_operand = /^([\w\d_]+)(\?&|>|<|~|\?)$/;

pi.utils.matchers = (function() {
  function matchers() {}

  matchers.object = function(obj, all) {
    var key, val, _fn;
    if (all == null) {
      all = true;
    }
    _fn = (function(_this) {
      return function(key, val) {
        if (val == null) {
          return obj[key] = function(value) {
            return !value;
          };
        } else if (typeof val === "object") {
          return obj[key] = _this.object(val, all);
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
      return _any;
    };
  };

  matchers.nod = function(string) {
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

  matchers.object_ext = function(obj, all) {
    var key, matchers, matches, val;
    if (all == null) {
      all = true;
    }
    matchers = {};
    for (key in obj) {
      if (!__hasProp.call(obj, key)) continue;
      val = obj[key];
      if ((val != null) && (typeof val === 'object' && !(Array.isArray(val)))) {
        matchers[key] = this.object_ext(val, all);
      } else {
        if ((matches = key.match(_key_operand))) {
          matchers[matches[1]] = _operands[matches[2]](val);
        } else {
          matchers[key] = val;
        }
      }
    }
    return this.object(matchers, all);
  };

  return matchers;

})();



},{"../pi":47,"./base":48}],54:[function(require,module,exports){
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



},{"../pi":47,"./base":48}],55:[function(require,module,exports){
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



},{"../core":45,"./net":57}],56:[function(require,module,exports){
'use strict';
require('./net');

require('./iframe.upload');



},{"./iframe.upload":55,"./net":57}],57:[function(require,module,exports){
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

  Net._prepare_error = function(xhr) {
    var response, type;
    type = xhr.getResponseHeader('Content-Type');
    return response = /json/.test(type) ? JSON.parse(xhr.responseText || ("{\"status\":" + xhr.statusText + "}")) : xhr.responseText || xhr.statusText;
  };

  Net._is_app_error = function(status) {
    return status >= 400 && status < 500;
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
      return function(resolve, reject) {
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
        if (typeof options.progress === 'function') {
          req.upload.onprogress = function(event) {
            value = event.lengthComputable ? event.loaded * 100 / event.total : 0;
            return options.progress(Math.round(value));
          };
        }
        req.onreadystatechange = function() {
          if (req.readyState !== 4) {
            return;
          }
          if (_this._is_success(req.status)) {
            return resolve(_this._prepare_response(req));
          } else if (_this._is_app_error(req.status)) {
            return reject(Error(_this._prepare_error(req)));
          } else {
            return reject(Error('500 Internal Server Error'));
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
          var e;
          if (response == null) {
            reject(Error('Response is empty'));
          }
          if (!as_json) {
            resolve(response.innerHtml);
          }
          response = (function() {
            try {
              return JSON.parse(response.innerHTML);
            } catch (_error) {
              e = _error;
              return JSON.parse(response.innerText);
            }
          })();
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



},{"../core":45}],58:[function(require,module,exports){
'use strict'
window.pi = require('./core')
require('./components')
require('./net')
require('./resources')
require('./controllers')
require('./views')
module.exports = window.pi
},{"./components":16,"./controllers":33,"./core":45,"./net":56,"./resources":75,"./views":82}],59:[function(require,module,exports){
'use strict';
require('./selectable');

require('./scrollable');

require('./renderable');



},{"./renderable":60,"./scrollable":61,"./selectable":62}],60:[function(require,module,exports){
'use strict';
var pi, utils, _renderer_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/pieces');

require('../plugin');

utils = pi.utils;

_renderer_reg = /(\w+)(?:\(([\w\-\/]+)\))?/;

pi.Base.Renderable = (function(_super) {
  __extends(Renderable, _super);

  function Renderable() {
    return Renderable.__super__.constructor.apply(this, arguments);
  }

  Renderable.prototype.id = 'renderable';

  Renderable.included = function(klass) {
    var self;
    self = this;
    return klass.before_initialize(function() {
      return this.attach_plugin(self);
    });
  };

  Renderable.prototype.initialize = function(target) {
    this.target = target;
    Renderable.__super__.initialize.apply(this, arguments);
    this.target._renderer = this.find_renderer();
    this.target.delegate_to(this, 'render');
  };

  Renderable.prototype.render = function(data) {
    var nod;
    this.target.remove_children();
    if (data != null) {
      nod = this.target._renderer.render(data);
      nod.host = this.target;
      if (nod != null) {
        this.target.append(nod);
        this.target.piecify();
      } else {
        utils.error("failed to render data for: " + this.target.pid + "}");
      }
    }
    return this.target;
  };

  Renderable.prototype.find_renderer = function() {
    var klass, name, param, _, _ref;
    if ((this.target.options.renderer != null) && _renderer_reg.test(this.target.options.renderer)) {
      _ref = this.target.options.renderer.match(_renderer_reg), _ = _ref[0], name = _ref[1], param = _ref[2];
      klass = pi.Renderers[utils.camelCase(name)];
      if (klass != null) {
        return new klass(param);
      }
    }
    return new pi.Renderers.Base();
  };

  return Renderable;

})(pi.Plugin);



},{"../../components/pieces":17,"../../core":45,"../plugin":72}],61:[function(require,module,exports){
'use strict';
var Nod, binfo, pi, utils, _style_type,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/pieces');

require('../plugin');

utils = pi.utils;

Nod = pi.Nod;

_style_type = {};

binfo = utils.browser.info();

if ((utils.browser.scrollbar_width() === 0 && !binfo.webkit) || (binfo.msie && (binfo.version | 0) > 9)) {
  _style_type.padding = 17;
  _style_type.position = 17;
} else if (utils.browser.scrollbar_width() > 0) {
  _style_type.position = 17;
} else if (binfo.chrome) {
  _style_type.padding = 7;
  _style_type.position = 17;
}

utils.info('scroller type', _style_type);

pi.Base.Scrollable = (function(_super) {
  __extends(Scrollable, _super);

  function Scrollable() {
    return Scrollable.__super__.constructor.apply(this, arguments);
  }

  Scrollable.prototype.id = 'scollable';

  Scrollable.prototype.initialize = function(pane) {
    this.pane = pane;
    this.content = this.pane.find('.pi-scroll-content');
    if (!this.content) {
      this.content = pi.Nod.create(this.pane.node.children[0]).addClass('pi-scroll-content');
    }
    this.create_scroller();
    this.hide_native_scroller();
    this.always_show = this.pane.hasClass('has-scroller');
    this.setup_events();
    return this.update_thumb();
  };

  Scrollable.prototype.create_scroller = function() {
    this.track = Nod.create('div').addClass('pi-scroll-track');
    this.thumb = Nod.create('div').addClass('pi-scroll-thumb');
    this.track.append(this.thumb);
    this.pane.append(this.track);
    return this.pane.addClass('pi-scroll-pane');
  };

  Scrollable.prototype.hide_native_scroller = function() {
    var cssRule, currentPadding;
    cssRule = {};
    if (_style_type.padding) {
      currentPadding = window.getComputedStyle(this.content.node, null).getPropertyValue('padding-right').replace(/[^0-9.]+/g, '');
      cssRule.paddingRight = "" + (+currentPadding + (utils.browser.scrollbar_width() || _style_type.padding)) + "px";
    }
    if (_style_type.position) {
      cssRule.right = "-" + (utils.browser.scrollbar_width() || _style_type.position) + "px";
    }
    return this.content.style(cssRule);
  };

  Scrollable.prototype.setup_events = function() {
    this.content.on('mousewheel', this.scroll_listener());
    this.thumb.on('mousedown', this.thumb_mouse_down());
    return this.track.on('click', this.track_click());
  };

  Scrollable.prototype.scroll_listener = function() {
    return this._sl || (this._sl = (function(_this) {
      return function(e) {
        return _this.update_thumb(e);
      };
    })(this));
  };

  Scrollable.prototype.thumb_mouse_down = function() {
    return this.__tmd || (this.__tmd = (function(_this) {
      return function(e) {
        e.cancel();
        _this._wait_drag = utils.after(300, function() {
          _this._startY = e.pageY;
          _this.track.addClass('is-active');
          _this._start_point = _this.thumb.offset().y;
          utils.debug('start_move');
          _this.update_scroll();
          pi.Nod.root.on('mousemove', _this.track_mouse_move());
          _this.track.off('click', _this.track_click());
          _this.content.off('mousewheel', _this.scroll_listener());
          return _this._dragging = true;
        });
        return pi.Nod.root.on('mouseup', _this.mouse_up_listener());
      };
    })(this));
  };

  Scrollable.prototype.track_mouse_move = function() {
    return this.__tmm || (this.__tmm = (function(_this) {
      return function(e) {
        return _this.update_scroll(e);
      };
    })(this));
  };

  Scrollable.prototype.track_click = function() {
    return this._tc || (this._tc = (function(_this) {
      return function(e) {
        var ch, h, track_y, y;
        h = _this.thumb.clientHeight();
        ch = _this.content.clientHeight();
        track_y = _this.track.y();
        y = e.pageY - track_y;
        if (y > ch - h) {
          y = ch - h;
        }
        if (y < 0) {
          y = 0;
        }
        _this.thumb.moveY(y);
        return _this.update_scroll();
      };
    })(this));
  };

  Scrollable.prototype.mouse_up_listener = function() {
    return this.__mul || (this.__mul = (function(_this) {
      return function() {
        _this.track.removeClass('is-active');
        clearTimeout(_this._wait_drag);
        utils.debug('stop_move');
        pi.Nod.root.off('mousemove', _this.track_mouse_move());
        pi.Nod.root.off('mouseup', _this.mouse_up_listener());
        after(500, function() {
          return _this.track.on('click', _this.track_click());
        });
        return _this.content.on('mousewheel', _this.scroll_listener());
      };
    })(this));
  };

  Scrollable.prototype.update_scroll = function(e) {
    var ch, h, sh, st, y;
    h = this.thumb.clientHeight();
    sh = this.content.scrollHeight();
    ch = this.content.clientHeight();
    st = this.content.scrollTop();
    if (e != null) {
      y = (e.pageY - this._startY) + this._start_point;
      if (y > ch - h) {
        y = ch - h;
      }
      if (y < 0) {
        y = 0;
      }
      this.thumb.moveY(y);
    } else {
      y = this.thumb.offset().y;
    }
    this._last_scroll = (sh - ch) * (y / (ch - h));
    return this.content.scrollY(this._last_scroll);
  };

  Scrollable.prototype.update_thumb = function(e) {
    var ch, h, sh, st, y;
    sh = this.content.scrollHeight();
    ch = this.content.clientHeight();
    st = this.content.scrollTop();
    this._last_scroll = st;
    if (ch === sh) {
      this.thumb.hide();
      if (!this.always_show) {
        this.track.hide();
      }
      return;
    } else if (!this.thumb.visible) {
      this.thumb.show();
      if (!this.always_show) {
        this.track.show();
      }
    }
    h = Math.max(20, ch * (ch / sh));
    y = (ch - h) * (st / (sh - ch));
    if ((y < 0) || (y > ch - h)) {
      if (e != null) {
        e.cancel();
      }
      return;
    }
    if (e != null) {
      if (y === 0 && e.wheelDelta > 0) {
        e.cancel();
      }
    }
    this.thumb.moveY(y);
    return this.thumb.height(h);
  };

  return Scrollable;

})(pi.Plugin);



},{"../../components/pieces":17,"../../core":45,"../plugin":72}],62:[function(require,module,exports){
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
        _this.toggle_select();
        return false;
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



},{"../../components/pieces":17,"../../core":45,"../plugin":72}],63:[function(require,module,exports){
'use strict';
require('./plugin');

require('./base');

require('./list');



},{"./base":59,"./list":65,"./plugin":72}],64:[function(require,module,exports){
'use strict';
var pi, utils, _is_continuation,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

utils = pi.utils;

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
    return this.list.on('update', ((function(_this) {
      return function(e) {
        return _this.item_updated(e.data.item);
      };
    })(this)), this, (function(_this) {
      return function(e) {
        return (e.data.type === 'item_added' || e.data.type === 'item_updated') && e.data.item.host === _this.list;
      };
    })(this));
  };

  Filterable.prototype.item_updated = function(item) {
    if (!this.matcher) {
      return false;
    }
    if (this._all_items.indexOf(item) < 0) {
      this._all_items.unshift(item);
    }
    if (this.matcher(item)) {
      return;
    } else if (this.filtered) {
      this.list.remove_item(item, true);
    }
    return false;
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
    this.matcher = null;
    return this.list.trigger('filter_stop');
  };

  Filterable.prototype.filter = function(params) {
    var item, scope, _buffer;
    if (params == null) {
      return this.stop_filter();
    }
    if (!this.filtered) {
      this.start_filter();
    }
    scope = _is_continuation(this._prevf, params) ? this.list.items.slice() : this.all_items();
    this._prevf = params;
    this.matcher = utils.matchers.object_ext({
      record: params
    });
    _buffer = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = scope.length; _i < _len; _i++) {
        item = scope[_i];
        if (this.matcher(item)) {
          _results.push(item);
        }
      }
      return _results;
    }).call(this);
    this.list.data_provider(_buffer);
    return this.list.trigger('filter_update');
  };

  return Filterable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":45,"../plugin":72}],65:[function(require,module,exports){
'use strict';
require('./selectable');

require('./sortable');

require('./searchable');

require('./filterable');

require('./scrollend');

require('./move_select');

require('./nested_select');



},{"./filterable":64,"./move_select":66,"./nested_select":67,"./scrollend":68,"./searchable":69,"./selectable":70,"./sortable":71}],66:[function(require,module,exports){
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



},{"../../components/base/list":6,"../../core":45,"../plugin":72,"./selectable":70}],67:[function(require,module,exports){
'use strict';
var pi, utils, _null,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../components/base/list');

require('../plugin');

require('./selectable');

utils = pi.utils;

_null = function() {};

pi.List.NestedSelect = (function(_super) {
  __extends(NestedSelect, _super);

  function NestedSelect() {
    return NestedSelect.__super__.constructor.apply(this, arguments);
  }

  NestedSelect.prototype.id = 'nested_select';

  NestedSelect.prototype.initialize = function(list) {
    this.list = list;
    pi.Plugin.prototype.initialize.apply(this, arguments);
    this.selectable = this.list.selectable || {
      select_all: _null,
      clear_selection: _null,
      type: _null,
      _selected_item: null,
      enable: _null,
      disable: _null
    };
    this.list.delegate_to(this, 'clear_selection', 'select_all', 'selected', 'where', 'select_item', 'deselect_item');
    if (this.list.has_selectable !== true) {
      this.list.delegate_to(this, 'selected_records', 'selected_record', 'selected_item', 'selected_size');
    }
    this.enabled = true;
    if (this.list.options.no_select != null) {
      this.disable();
    }
    this.type(this.list.options.nested_select_type || "");
    this.list.on('selection_cleared,selected', (function(_this) {
      return function(e) {
        var item;
        if (_this._watching_radio && e.type === 'selected') {
          if (e.target === _this.list) {
            item = _this.selectable._selected_item;
          } else {
            item = e.data[0].host.selectable._selected_item;
          }
          _this.update_radio_selection(item);
        }
        if (e.target !== _this.list) {
          e.cancel();
          return _this._check_selected();
        } else {
          return false;
        }
      };
    })(this));
  };

  NestedSelect.prototype.enable = function() {
    var item, _i, _len, _ref, _ref1, _results;
    if (!this.enabled) {
      this.enabled = true;
      this.selectable.enable();
      _ref = this.list.find_cut('.pi-list');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push((_ref1 = item._nod.selectable) != null ? _ref1.enable() : void 0);
      }
      return _results;
    }
  };

  NestedSelect.prototype.disable = function() {
    var item, _i, _len, _ref, _ref1, _results;
    if (this.enabled) {
      this.enabled = false;
      this.selectable.disable();
      _ref = this.list.find_cut('.pi-list');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push((_ref1 = item._nod.selectable) != null ? _ref1.disable() : void 0);
      }
      return _results;
    }
  };

  NestedSelect.prototype.select_item = function(item, force) {
    var _ref;
    if (force == null) {
      force = false;
    }
    if (!item.__selected__) {
      if (this._watching_radio) {
        this.clear_selection(true);
      }
      if ((_ref = item.host.selectable) != null) {
        if (typeof _ref.select_item === "function") {
          _ref.select_item(item, force);
        }
      }
      this._check_selected();
      return item;
    }
  };

  NestedSelect.prototype.deselect_item = function(item, force) {
    var _ref;
    if (force == null) {
      force = false;
    }
    if (item.__selected__) {
      if ((_ref = item.host.selectable) != null) {
        if (typeof _ref.deselect_item === "function") {
          _ref.deselect_item(item, force);
        }
      }
      this._check_selected();
      return item;
    }
  };

  NestedSelect.prototype.where = function(query) {
    var item, ref, _i, _len, _ref;
    ref = pi.List.prototype.where.call(this.list, query);
    _ref = this.list.find_cut('.pi-list');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      ref = ref.concat(item._nod.where(query));
    }
    return ref;
  };

  NestedSelect.prototype.type = function(value) {
    this.is_radio = !!value.match('radio');
    if (this.is_radio) {
      return this.enable_radio_watch();
    } else {
      return this.disable_radio_watch();
    }
  };

  NestedSelect.prototype.enable_radio_watch = function() {
    return this._watching_radio = true;
  };

  NestedSelect.prototype.disable_radio_watch = function() {
    return this._watching_radio = false;
  };

  NestedSelect.prototype.update_radio_selection = function(item) {
    if (!item || (this._prev_selected_list === item.host)) {
      return;
    }
    this._prev_selected_list = item.host;
    if (this.list.selected().length > 1) {
      this.list.clear_selection(true);
      item.host.select_item(item);
    }
  };

  NestedSelect.prototype.clear_selection = function(silent) {
    var item, _base, _i, _len, _ref;
    if (silent == null) {
      silent = false;
    }
    this.selectable.clear_selection(silent);
    _ref = this.list.find_cut('.pi-list');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (typeof (_base = item._nod).clear_selection === "function") {
        _base.clear_selection(silent);
      }
    }
    if (!silent) {
      return this.list.trigger('selection_cleared');
    }
  };

  NestedSelect.prototype.select_all = function() {
    var item, _base, _i, _len, _ref, _selected;
    this.selectable.select_all(true);
    _ref = this.list.find_cut('.pi-list');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (typeof (_base = item._nod).select_all === "function") {
        _base.select_all(true);
      }
    }
    _selected = this.selected();
    if (_selected.length) {
      return this.list.trigger('selected', _selected);
    }
  };

  NestedSelect.prototype.selected = function() {
    var item, sublist, _i, _len, _ref, _selected;
    _selected = [];
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.__selected__) {
        _selected.push(item);
      }
      if (item instanceof pi.List) {
        _selected = _selected.concat((typeof item.selected === "function" ? item.selected() : void 0) || []);
      } else if ((sublist = item.find('.pi-list'))) {
        _selected = _selected.concat((typeof sublist.selected === "function" ? sublist.selected() : void 0) || []);
      }
    }
    return _selected;
  };

  return NestedSelect;

})(pi.List.Selectable);



},{"../../components/base/list":6,"../../core":45,"../plugin":72,"./selectable":70}],68:[function(require,module,exports){
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
    this.scroll_object = this.list.options.scroll_object === 'window' ? pi.Nod.win : this.list.options.scroll_object ? pi.$(this.list.options.scroll_object) : this.list.items_cont;
    this._prev_top = this.scroll_object.scrollTop();
    if (this.list.options.scroll_end !== false) {
      this.enable();
    }
    this.list.on('update', this.scroll_listener(), this, (function(_this) {
      return function(e) {
        return e.data.type === 'item_removed' || e.data.type === 'load';
      };
    })(this));
    this.list.on('destroyed', ((function(_this) {
      return function() {
        _this.disable();
        return false;
      };
    })(this)));
  };

  ScrollEnd.prototype.enable = function() {
    if (this.enabled) {
      return;
    }
    this.scroll_object.on('scroll', this.scroll_listener());
    return this.enabled = true;
  };

  ScrollEnd.prototype.disable = function() {
    if (!this.enabled) {
      return;
    }
    this.__debounce_id__ && clearTimeout(this.__debounce_id__);
    this.scroll_object.off('scroll', this.scroll_listener());
    this._scroll_listener = null;
    return this.enabled = false;
  };

  ScrollEnd.prototype.scroll_listener = function() {
    return this._scroll_listener || (this._scroll_listener = utils.debounce(500, ((function(_this) {
      return function(event) {
        if (_this.list._disposed) {
          return false;
        }
        if (_this._prev_top <= _this.scroll_object.scrollTop() && _this.list.height() - _this.scroll_object.scrollTop() - _this.scroll_object.height() < 50) {
          _this.list.trigger('scroll_end');
        }
        _this._prev_top = _this.scroll_object.scrollTop();
        return false;
      };
    })(this)), this));
  };

  return ScrollEnd;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":45,"../plugin":72}],69:[function(require,module,exports){
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
    this.list.on('update', ((function(_this) {
      return function(e) {
        return _this.item_updated(e.data.item);
      };
    })(this)), this, (function(_this) {
      return function(e) {
        return (e.data.type === 'item_added' || e.data.type === 'item_updated') && e.data.item.host === _this.list;
      };
    })(this));
  };

  Searchable.prototype.item_updated = function(item) {
    if (!this.matcher) {
      return false;
    }
    if (this._all_items.indexOf(item) < 0) {
      this._all_items.unshift(item);
    }
    if (this.matcher(item)) {
      this.highlight_item(this._prevq, item);
      return;
    } else if (this.searching) {
      this.list.remove_item(item, true);
    }
    return false;
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
    return this.matcher_factory = scope == null ? function(value) {
      return utils.matchers.nod(value);
    } : function(value) {
      return utils.matchers.nod(scope + ':' + value);
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
    this.matcher = null;
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
    var item, scope, _buffer;
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
    this.matcher = this.matcher_factory(q);
    _buffer = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = scope.length; _i < _len; _i++) {
        item = scope[_i];
        if (this.matcher(item)) {
          _results.push(item);
        }
      }
      return _results;
    }).call(this);
    this.list.data_provider(_buffer);
    if (highlight) {
      this.highlight(q);
    }
    return this.list.trigger('search_update');
  };

  return Searchable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":45,"../plugin":72}],70:[function(require,module,exports){
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
    this.list.merge_classes.push('is-selected');
    this.type(this.list.options.select_type || 'radio');
    if (this.list.options.no_select == null) {
      this.enable();
    }
    _ref = this.list.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.hasClass('is-selected')) {
        item.__selected__ = true;
      }
    }
    this.list.delegate_to(this, 'clear_selection', 'selected', 'selected_item', 'select_all', 'select_item', 'selected_records', 'selected_record', 'deselect_item', 'toggle_select', 'selected_size');
    this.list.on('update', ((function(_this) {
      return function(e) {
        _this._selected = null;
        _this._check_selected();
        return false;
      };
    })(this)), this, function(e) {
      return e.data.type !== 'item_added';
    });
  };

  Selectable.prototype.enable = function() {
    if (!this.enabled) {
      this.enabled = true;
      return this.list.on('item_click', this.item_click_handler());
    }
  };

  Selectable.prototype.disable = function() {
    if (this.enabled) {
      this.enabled = false;
      return this.list.off('item_click', this.item_click_handler());
    }
  };

  Selectable.prototype.type = function(value) {
    this.is_radio = !!value.match('radio');
    return this.is_check = !!value.match('check');
  };

  Selectable.prototype.item_click_handler = function() {
    return this._item_click_handler || (this._item_click_handler = (function(_this) {
      return function(e) {
        _this.list.toggle_select(e.data.item, true);
        if (e.data.item.enabled) {
          _this._check_selected();
        }
      };
    })(this));
  };

  Selectable.prototype._check_selected = function() {
    if (this.list.selected().length) {
      return this.list.trigger('selected', this.list.selected());
    } else {
      return this.list.trigger('selection_cleared');
    }
  };

  Selectable.prototype.select_item = function(item, force) {
    if (force == null) {
      force = false;
    }
    if (!item.__selected__ && (item.enabled || !force)) {
      if (this.is_radio && force) {
        this.clear_selection(true);
      }
      item.__selected__ = true;
      this._selected_item = item;
      this._selected = null;
      return item.addClass('is-selected');
    }
  };

  Selectable.prototype.deselect_item = function(item, force) {
    if (force == null) {
      force = false;
    }
    if (item.__selected__ && ((item.enabled && this.is_check) || (!force))) {
      item.__selected__ = false;
      this._selected = null;
      if (this._selected_item === item) {
        this._selected_item = null;
      }
      return item.removeClass('is-selected');
    }
  };

  Selectable.prototype.toggle_select = function(item, force) {
    if (item.__selected__) {
      return this.deselect_item(item, force);
    } else {
      return this.select_item(item, force);
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



},{"../../components/base/list":6,"../../core":45,"../plugin":72}],71:[function(require,module,exports){
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
    var param, _fn, _i, _len, _ref;
    this.list = list;
    Sortable.__super__.initialize.apply(this, arguments);
    if (this.list.options.sort != null) {
      this._prevs = [];
      _ref = this.list.options.sort.split(",");
      _fn = (function(_this) {
        return function(param) {
          var data, key, order, _ref1;
          data = {};
          _ref1 = param.split(":"), key = _ref1[0], order = _ref1[1];
          data[key] = order;
          return _this._prevs.push(data);
        };
      })(this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        _fn(param);
      }
      this._compare_fun = function(a, b) {
        return utils.keys_compare(a.record, b.record, this._prevs);
      };
    }
    this.list.delegate_to(this, 'sort');
    return this.list.on('update', ((function(_this) {
      return function(e) {
        return _this.item_updated(e.data.item);
      };
    })(this)), this, (function(_this) {
      return function(e) {
        return (e.data.type === 'item_added' || e.data.type === 'item_updated') && e.data.item.host === _this.list;
      };
    })(this));
  };

  Sortable.prototype.item_updated = function(item) {
    if (!this._compare_fun) {
      return false;
    }
    this._bisect_sort(item, 0, this.list.size() - 1);
    return false;
  };

  Sortable.prototype._bisect_sort = function(item, left, right) {
    var a, i;
    if (right - left < 2) {
      if (this._compare_fun(item, this.list.items[left]) > 0) {
        this.list.move_item(item, right);
      } else {
        this.list.move_item(item, left);
      }
      return;
    }
    i = (left + (right - left) / 2) | 0;
    a = this.list.items[i];
    if (this._compare_fun(item, a) > 0) {
      left = i;
    } else {
      right = i;
    }
    return this._bisect_sort(item, left, right);
  };

  Sortable.prototype.sort = function(sort_params) {
    if (sort_params == null) {
      return;
    }
    sort_params = utils.to_a(sort_params);
    this._prevs = sort_params;
    this._compare_fun = function(a, b) {
      return utils.keys_compare(a.record, b.record, sort_params);
    };
    this.list.items.sort(this._compare_fun);
    this.list.data_provider(this.list.items.slice());
    return this.list.trigger('sort_update', sort_params);
  };

  Sortable.prototype.sorted = function(sort_params) {
    if (sort_params == null) {
      return;
    }
    sort_params = utils.to_a(sort_params);
    this._prevs = sort_params;
    this._compare_fun = function(a, b) {
      return utils.keys_compare(a.record, b.record, sort_params);
    };
    return this.list.trigger('sort_update', sort_params);
  };

  return Sortable;

})(pi.Plugin);



},{"../../components/base/list":6,"../../core":45,"../plugin":72}],72:[function(require,module,exports){
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



},{"../core":45}],73:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base');

require('./view');

utils = pi.utils;

pi.resources.Association = (function(_super) {
  __extends(Association, _super);

  function Association(resources, scope, options) {
    this.resources = resources;
    this.options = options != null ? options : {};
    Association.__super__.constructor.apply(this, arguments);
    this._only_update = false;
    this.owner = this.options.owner;
    if (options.belongs_to === true) {
      if (options.owner._persisted) {
        this.owner_name_id = this.options.key;
      } else {
        this._only_update = true;
        this.options.owner.one('create', ((function(_this) {
          return function() {
            var _ref;
            _this._only_update = false;
            _this.owner = _this.options.owner;
            _this.owner_name_id = _this.options.key;
            if (_this.options._scope !== false) {
              if (((_ref = _this.options._scope) != null ? _ref[_this.options.key] : void 0) != null) {
                _this.options.scope = utils.merge(_this.options._scope, utils.wrap(_this.options.key, _this.owner.id));
              } else {
                _this.options.scope = utils.wrap(_this.options.key, _this.owner.id);
              }
              return _this.reload();
            }
          };
        })(this)));
      }
    } else {
      if (!this.options.scope) {
        this._only_update = true;
      }
    }
  }

  Association.prototype.clear_all = function() {
    if (this.options.route) {
      this.owner["" + this.options.name + "_loaded"] = false;
    }
    return Association.__super__.clear_all.apply(this, arguments);
  };

  Association.prototype.reload = function() {
    this.clear_all();
    if (this.options.scope) {
      this._filter = utils.matchers.object_ext(this.options.scope);
      return this.load(this.options.source.where(this.options.scope));
    }
  };

  Association.prototype.build = function(data, silent, params) {
    if (data == null) {
      data = {};
    }
    if (silent == null) {
      silent = false;
    }
    if (params == null) {
      params = {};
    }
    if (this.options.belongs_to === true) {
      if (data[this.owner_name_id] == null) {
        data[this.owner_name_id] = this.owner.id;
      }
      if (!(data instanceof pi.resources.Base)) {
        data = this.resources.build(data, false);
      }
    }
    return Association.__super__.build.call(this, data, silent, params);
  };

  Association.prototype.on_update = function(el) {
    if (this.get(el.id)) {
      if (this.options.copy === false) {
        return this.trigger('update', this._wrap(el));
      } else {
        return Association.__super__.on_update.apply(this, arguments);
      }
    } else if (this._only_update === false) {
      return this.build(el);
    }
  };

  Association.prototype.on_destroy = function(el) {
    if (this.options.copy === false) {
      return this.trigger('destroy', this._wrap(el));
    } else {
      return Association.__super__.on_destroy.apply(this, arguments);
    }
  };

  Association.prototype.on_create = function(el) {
    var view_item;
    if (this._only_update) {
      return;
    }
    if ((view_item = this.get(el.id))) {
      if (this.options.copy === false) {
        return this.trigger('create', this._wrap(el));
      } else {
        return view_item.set(el.attributes());
      }
    } else {
      return this.build(el);
    }
  };

  Association.prototype.on_load = function() {
    if (this._only_update) {
      return;
    }
    if (this.options.scope) {
      this.load(this.resources.where(this.options.scope));
      return this.trigger('load', {});
    }
  };

  return Association;

})(pi.resources.View);



},{"../core":45,"./base":74,"./view":80}],74:[function(require,module,exports){
'use strict';
var pi, utils, _singular,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

utils = pi.utils;

pi.resources = {};

pi["export"](pi.resources, "$r");

_singular = function(str) {
  return str.replace(/s$/, '');
};

pi.resources.Base = (function(_super) {
  __extends(Base, _super);

  Base.set_resource = function(plural, singular) {
    this.__all_by_id__ = {};
    this.__all__ = [];
    this.resources_name = plural;
    return this.resource_name = singular || _singular(plural);
  };

  Base.load = function(data, silent) {
    var el, elements;
    if (silent == null) {
      silent = false;
    }
    if (data != null) {
      elements = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          el = data[_i];
          _results.push(this.build(el, true));
        }
        return _results;
      }).call(this);
      if (!silent) {
        this.trigger('load', {});
      }
      return elements;
    }
  };

  Base.clear_all = function() {
    var el, _i, _len, _ref;
    _ref = this.__all__;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      el.dispose();
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
          this.trigger('create', this._wrap(el));
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
    if (this.__all_by_id__[el.id] != null) {
      this.__all__.splice(this.__all__.indexOf(el), 1);
      delete this.__all_by_id__[el.id];
    }
    if (!silent) {
      this.trigger('destroy', this._wrap(el));
    }
    el.dispose();
    return true;
  };

  Base.listen = function(callback, filter) {
    return pi.event.on("" + this.resources_name + "_update", callback, null, filter);
  };

  Base.trigger = function(event, data) {
    data.type = event;
    return pi.event.trigger("" + this.resources_name + "_update", data, false);
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

  Base.where = function(params) {
    var el, _i, _len, _ref, _results;
    _ref = this.__all__;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      if (utils.matchers.object_ext(params)(el)) {
        _results.push(el);
      }
    }
    return _results;
  };

  Base._wrap = function(el) {
    if (el instanceof pi.resources.Base) {
      return utils.wrap(el.constructor.resource_name, el);
    } else {
      return el;
    }
  };

  function Base(data) {
    if (data == null) {
      data = {};
    }
    Base.__super__.constructor.apply(this, arguments);
    this._changes = {};
    if (data.id != null) {
      this._persisted = true;
    }
    this.initialize(data);
  }

  Base.prototype.initialize = function(data) {
    if (this._initialized) {
      return;
    }
    this.set(data, true);
    return this._initialized = true;
  };

  Base.register_callback('initialize');

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

  Base.register_callback('dispose', {
    as: 'destroy'
  });

  Base.prototype.remove = function(silent) {
    if (silent == null) {
      silent = false;
    }
    return this.constructor.remove(this, silent);
  };

  Base.prototype.attributes = function() {
    var change, key, res, _ref;
    res = {};
    _ref = this._changes;
    for (key in _ref) {
      change = _ref[key];
      res[key] = change.val;
    }
    return res;
  };

  Base.prototype.set = function(params, silent) {
    var key, type, val, _changed, _was_id;
    _changed = false;
    _was_id = this.id;
    for (key in params) {
      if (!__hasProp.call(params, key)) continue;
      val = params[key];
      if (this[key] !== val && !(typeof this[key] === 'function')) {
        _changed = true;
        this._changes[key] = {
          old_val: this[key],
          val: val
        };
        this[key] = val;
      }
    }
    type = (params.id != null) && !_was_id ? 'create' : 'update';
    if (_changed && !silent) {
      this.trigger(type, (type === 'create' ? this : this._changes));
    }
    return this;
  };

  Base.register_callback('set', {
    as: 'update'
  });

  Base.prototype.trigger = function(e, data, bubbles) {
    if (bubbles == null) {
      bubbles = false;
    }
    Base.__super__.trigger.apply(this, arguments);
    return this.constructor.trigger(e, this.constructor._wrap(this));
  };

  return Base;

})(pi.EventDispatcher);



},{"../core":45}],75:[function(require,module,exports){
'use strict';
require('./base');

require('./view');

require('./association');

require('./rest');

require('./modules');



},{"./association":73,"./base":74,"./modules":77,"./rest":79,"./view":80}],76:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../../core');

require('../rest');

utils = pi.utils;

pi.resources.HasMany = (function() {
  function HasMany() {}

  HasMany.extended = function(klass) {
    return true;
  };

  HasMany.has_many = function(name, params) {
    var _old;
    if (params == null) {
      throw Error("Has many require at least 'source' param");
    }
    utils.extend(params, {
      path: ":resources/:id/" + name,
      method: 'get'
    });
    this.prototype[name] = function() {
      var default_scope, options;
      if (this["__" + name + "__"] == null) {
        options = {
          name: name,
          owner: this
        };
        if (params.belongs_to === true) {
          options.key = params.key || ("" + this.constructor.resource_name + "_id");
          if (params.copy == null) {
            options.copy = false;
          }
          options._scope = params.scope;
          default_scope = utils.wrap(options.key, this.id);
          if (params.scope == null) {
            options.scope = this._persisted ? default_scope : false;
          } else {
            options.scope = params.scope;
          }
          if (params.params != null) {
            params.params.push("" + this.constructor.resource_name + "_id");
          }
        }
        utils.extend(options, params);
        this["__" + name + "__"] = new pi.resources.Association(params.source, options.scope, options);
        if (options.scope !== false) {
          this["__" + name + "__"].load(params.source.where(options.scope));
        }
      }
      return this["__" + name + "__"];
    };
    if (params.route === true) {
      this.routes({
        member: [
          {
            action: "load_" + name,
            path: params.path,
            method: params.method
          }
        ]
      });
      this.prototype["on_load_" + name] = function(data) {
        this["" + name + "_loaded"] = true;
        if (data[name] != null) {
          return this[name]().load(data[name]);
        }
      };
    }
    this.after_update(function(data) {
      if (data[name]) {
        this["" + name + "_loaded"] = true;
        return this[name]().load(data[name]);
      }
    });
    this.after_initialize(function() {
      return this[name]();
    });
    if (params.destroy === true) {
      this.before_destroy(function() {
        return this[name]().clear_all(true);
      });
    }
    if (params.attribute === true) {
      _old = this.prototype.attributes;
      return this.prototype.attributes = function() {
        var data;
        data = _old.call(this);
        data[name] = this[name]().serialize();
        return data;
      };
    }
  };

  return HasMany;

})();



},{"../../core":45,"../rest":79}],77:[function(require,module,exports){
'use strict';
require('./query');

require('./has_many');



},{"./has_many":76,"./query":78}],78:[function(require,module,exports){
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
        return _this.on_all(response);
      };
    })(this));
  };

  return Query;

})();



},{"../../core":45,"../rest":79}],79:[function(require,module,exports){
'use strict';
var pi, utils, _double_slashes_reg, _path_reg, _tailing_slash_reg,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

pi = require('../core');

require('./base');

utils = pi.utils;

_path_reg = /:(\w+)\b/g;

_double_slashes_reg = /\/\//;

_tailing_slash_reg = /\/$/;

pi.resources.REST = (function(_super) {
  __extends(REST, _super);

  REST._rscope = "/:path";

  REST.prototype.wrap_attributes = false;

  REST.prototype.__filter_params__ = false;

  REST.params = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (!this.prototype.hasOwnProperty("__filter_params__")) {
      this.prototype.__filter_params__ = [];
      this.prototype.__filter_params__.push('id');
    }
    return this.prototype.__filter_params__ = this.prototype.__filter_params__.concat(args);
  };

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
                  return _this.on_all(response);
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
              }), this).then((function(_this) {
                return function(response) {
                  if (_this["on_" + spec.action] != null) {
                    return _this["on_" + spec.action](response);
                  } else {
                    return _this.on_all(response);
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

  REST._interpolate_path = function(path, params, target) {
    var flag, part, path_parts, val, vars, _i, _len;
    path = this._rscope.replace(":path", path).replace(_double_slashes_reg, "/").replace(_tailing_slash_reg, '');
    path_parts = path.split(_path_reg);
    if (this.prototype.wrap_attributes && (params[this.resource_name] != null) && (typeof params[this.resource_name] === 'object')) {
      vars = utils.extend(params[this.resource_name], params, false, [this.resource_name]);
    } else {
      vars = params;
    }
    path = "";
    flag = false;
    for (_i = 0, _len = path_parts.length; _i < _len; _i++) {
      part = path_parts[_i];
      if (flag) {
        val = vars[part] != null ? vars[part] : target != null ? target[part] : void 0;
        if (val == null) {
          throw Error("undefined param: " + part);
        }
        path += val;
      } else {
        path += part;
      }
      flag = !flag;
    }
    return path;
  };

  REST.error = function(action, message) {
    return pi.event.trigger("net_error", {
      resource: this.resources_name,
      action: action,
      message: message
    });
  };

  REST._request = function(path, method, params, target) {
    path = this._interpolate_path(path, utils.merge(params, {
      resources: this.resources_name,
      resource: this.resource_name
    }), target);
    return pi.net[method].call(null, path, params)["catch"]((function(_this) {
      return function(error) {
        _this.error(error.message);
        throw error;
      };
    })(this));
  };

  REST.on_all = function(data) {
    if (data[this.resources_name] != null) {
      data[this.resources_name] = this.load(data[this.resources_name]);
    }
    return data;
  };

  REST.on_show = function(data) {
    var el;
    if (data[this.resource_name] != null) {
      el = this.build(data[this.resource_name], true);
      el._persisted = true;
      el.commit();
      return el;
    }
  };

  REST.build = function() {
    var el;
    el = REST.__super__.constructor.build.apply(this, arguments);
    return el;
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

  function REST(data) {
    REST.__super__.constructor.apply(this, arguments);
    this._snapshot = data;
  }

  REST.prototype.on_destroy = function(data) {
    this.constructor.remove(this);
    return data;
  };

  REST.prototype.on_all = function(data) {
    var params;
    params = data[this.constructor.resource_name];
    if ((params != null) && params.id === this.id) {
      this.set(params);
      this.commit();
      return this;
    }
  };

  REST.prototype.on_create = function(data) {
    var params;
    params = data[this.constructor.resource_name];
    if (params != null) {
      this._persisted = true;
      this.set(params, true);
      this.commit();
      this.constructor.add(this);
      this.trigger('create');
      return this;
    }
  };

  REST.prototype.attributes = function() {
    if (this.__attributes__changed__) {
      if (this.__filter_params__) {
        this.__attributes__ = utils.extract({}, this, this.__filter_params__);
      } else {
        this.__attributes__ = REST.__super__.attributes.apply(this, arguments);
      }
    }
    return this.__attributes__;
  };

  REST.prototype.set = function() {
    this.__attributes__changed__ = true;
    return REST.__super__.set.apply(this, arguments);
  };

  REST.prototype.save = function(params) {
    var attrs;
    if (params == null) {
      params = {};
    }
    attrs = this.attributes();
    utils.extend(attrs, params, true);
    attrs = this.wrap_attributes ? this._wrap(attrs) : attrs;
    if (this._persisted) {
      return this.update(attrs);
    } else {
      return this.create(attrs);
    }
  };

  REST.prototype.commit = function() {
    var key, param, _i, _len, _ref;
    _ref = this._changes;
    for (param = _i = 0, _len = _ref.length; _i < _len; param = ++_i) {
      key = _ref[param];
      this._snapshot[key] = param.val;
    }
    this._changes = {};
    return this._snapshot;
  };

  REST.prototype.rollback = function() {
    var key, param, _i, _len, _ref;
    _ref = this._changes;
    for (param = _i = 0, _len = _ref.length; _i < _len; param = ++_i) {
      key = _ref[param];
      this[key] = this._snapshot[key];
    }
  };

  REST.register_callback('save');

  REST.prototype._wrap = function(attributes) {
    var data;
    data = {};
    data[this.constructor.resource_name] = attributes;
    return data;
  };

  return REST;

})(pi.resources.Base);



},{"../core":45,"./base":74}],80:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base');

utils = pi.utils;

pi.resources.ViewItem = (function(_super) {
  __extends(ViewItem, _super);

  function ViewItem(view, data, options) {
    this.view = view;
    this.options = options != null ? options : {};
    ViewItem.__super__.constructor.apply(this, arguments);
    if ((this.options.params != null) && this.options.params.indexOf('id') < 0) {
      this.options.params.push('id');
    }
    this._changes = {};
    this.set(data, true);
  }

  utils.extend(ViewItem.prototype, pi.resources.Base.prototype, false);

  ViewItem.prototype.trigger = function(e, data, bubbles) {
    if (bubbles == null) {
      bubbles = true;
    }
    ViewItem.__super__.trigger.apply(this, arguments);
    return this.view.trigger(e, this.view._wrap(this));
  };

  ViewItem.prototype.attributes = function() {
    var data;
    if (this.options.params != null) {
      data = utils.extract({}, this, this.options.params);
      if (this.options.id_alias != null) {
        if (this.options.id_alias) {
          data[this.options.id_alias] = data.id;
        }
        delete data.id;
      }
      return data;
    } else {
      return pi.resources.Base.prototype.attributes.call(this);
    }
  };

  return ViewItem;

})(pi.EventDispatcher);

pi.resources.View = (function(_super) {
  __extends(View, _super);

  function View(resources, scope, options) {
    this.resources = resources;
    this.options = options != null ? options : {};
    View.__super__.constructor.apply(this, arguments);
    this.__all_by_id__ = {};
    this.__all__ = [];
    this.resources_name = this.resources.resources_name;
    this.resource_name = this.resources.resource_name;
    this._filter = (scope != null) && scope !== false ? utils.matchers.object_ext(scope) : function() {
      return true;
    };
    this.resources.listen((function(_this) {
      return function(e) {
        var el, _name;
        el = e.data[_this.resource_name];
        if (el != null) {
          if (!_this._filter(el)) {
            return;
          }
        }
        return typeof _this[_name = "on_" + e.data.type] === "function" ? _this[_name](el) : void 0;
      };
    })(this));
  }

  utils.extend(View.prototype, pi.resources.Base);

  View.prototype.on_update = function(el) {
    var view_item;
    if ((view_item = this.get(el.id))) {
      return view_item.set(el.attributes());
    }
  };

  View.prototype.on_destroy = function(el) {
    var view_item;
    if ((view_item = this.get(el.id))) {
      return this.remove(view_item);
    }
  };

  View.prototype.clear_all = function(force) {
    var el, _i, _j, _len, _len1, _ref, _ref1;
    if (force == null) {
      force = false;
    }
    if (!((this.options.copy === false) && (force === false))) {
      if (force && !this.options.copy) {
        this.__all_by_id__ = {};
        _ref = this.__all__;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          el.remove();
        }
      } else {
        _ref1 = this.__all__;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          el = _ref1[_j];
          el.dispose();
        }
      }
    }
    this.__all_by_id__ = {};
    return this.__all__.length = 0;
  };

  View.prototype.build = function(data, silent, params) {
    var el;
    if (data == null) {
      data = {};
    }
    if (silent == null) {
      silent = false;
    }
    if (params == null) {
      params = {};
    }
    if (!(el = this.get(data.id))) {
      if (data instanceof pi.resources.Base && this.options.copy === false) {
        el = data;
      } else {
        if (data instanceof pi.resources.Base) {
          data = data.attributes();
        }
        utils.extend(data, params, true);
        el = new pi.resources.ViewItem(this, data, this.options);
      }
      if (el.id) {
        this.add(el);
        if (!silent) {
          this.trigger('create', this._wrap(el));
        }
      }
      return el;
    } else {
      return el.set(data);
    }
  };

  View.prototype._wrap = function(el) {
    if (el instanceof pi.resources.ViewItem) {
      return utils.wrap(el.view.resource_name, el);
    } else if (el instanceof pi.resources.Base) {
      return utils.wrap(el.constructor.resource_name, el);
    } else {
      return el;
    }
  };

  View.prototype.serialize = function() {
    var el, res, _i, _len, _ref;
    res = [];
    _ref = this.all();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      res.push(el.attributes());
    }
    return res;
  };

  View.prototype.listen = function(callback) {
    return this.on("update", callback);
  };

  View.prototype.trigger = function(event, data) {
    data.type = event;
    return View.__super__.trigger.call(this, "update", data);
  };

  return View;

})(pi.EventDispatcher);



},{"../core":45,"./base":74}],81:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('../components/pieces');

utils = pi.utils;

utils.extend(pi.Base.prototype, {
  view: function() {
    return this.__view__ || (this.__view__ = this._find_view());
  },
  _find_view: function() {
    var comp;
    comp = this;
    while (comp) {
      if (comp.is_view === true) {
        return comp;
      }
      comp = comp.host;
    }
  }
});

pi.BaseView = (function(_super) {
  __extends(BaseView, _super);

  function BaseView() {
    return BaseView.__super__.constructor.apply(this, arguments);
  }

  BaseView.prototype.is_view = true;

  BaseView.prototype.postinitialize = function() {
    var controller_klass;
    controller_klass = null;
    if (this.options.controller) {
      controller_klass = utils.get_class_path(pi.controllers, this.options.controller);
    }
    controller_klass || (controller_klass = this.default_controller);
    if (controller_klass != null) {
      this.controller = new controller_klass(this);
      return pi.app.page.add_context(this.controller, this.options.main);
    }
  };

  BaseView.prototype.loaded = function(data) {};

  BaseView.prototype.reloaded = function(data) {};

  BaseView.prototype.switched = function() {};

  BaseView.prototype.unloaded = function() {};

  return BaseView;

})(pi.Base);



},{"../components/pieces":17,"../core":45}],82:[function(require,module,exports){
'use strict';
require('./base');

require('./plugins');

require('./modules');

require('./list.view');



},{"./base":81,"./list.view":83,"./modules":84,"./plugins":88}],83:[function(require,module,exports){
'use strict';
var pi, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../core');

require('./base');

utils = pi.utils;

pi.ListView = (function(_super) {
  __extends(ListView, _super);

  function ListView() {
    return ListView.__super__.constructor.apply(this, arguments);
  }

  ListView.include(pi.BaseView.Loadable, pi.BaseView.Listable);

  ListView.prototype.error = function(message) {
    return utils.error(message);
  };

  ListView.prototype.success = function(message) {
    return utils.info(message);
  };

  return ListView;

})(pi.BaseView);



},{"../core":45,"./base":81}],84:[function(require,module,exports){
'use strict'
require('./listable')
require('./loadable')
},{"./listable":85,"./loadable":86}],85:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../../core');

require('./../base');

utils = pi.utils;

pi.BaseView.Listable = (function() {
  function Listable() {}

  Listable.included = function(klass) {
    return klass.requires('list');
  };

  Listable.prototype.sort = function(params) {
    return this.list.sort(params);
  };

  Listable.prototype.sorted = function(params) {
    if (params != null) {
      return this.list.sortable.sorted(params);
    }
  };

  Listable.prototype.search = function(query) {
    this._query = query;
    return this.list.search(query, true);
  };

  Listable.prototype.searched = function(query) {
    utils.debug("loaded search " + query);
    this.list.searchable.start_search();
    if (query) {
      return this.list.highlight(query);
    } else {
      return this.list.searchable.stop_search(false);
    }
  };

  Listable.prototype.filter = function(data) {
    return this.list.filter(data);
  };

  Listable.prototype.filtered = function(data) {
    utils.debug("loaded filter", data);
    this.list.filterable.start_filter();
    if (data != null) {
      return this.list.trigger('filter_update');
    } else {
      return this.list.filterable.stop_filter(false);
    }
  };

  Listable.prototype.clear = function(data) {
    var _ref;
    utils.debug('clear list');
    this.list.clear();
    this.list.clear_selection() != null;
    return (_ref = this.list.scroll_end) != null ? _ref.disable() : void 0;
  };

  Listable.prototype.load = function(data) {
    var item, _i, _len;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      this.list.add_item(item, true);
    }
    return this.list.update();
  };

  Listable.prototype.reload = function(data) {
    this.list.data_provider(data);
    if (this._query) {
      return this.searched(this._query);
    }
  };

  return Listable;

})();



},{"../../core":45,"./../base":81}],86:[function(require,module,exports){
'use strict';
var pi, utils;

pi = require('../../core');

require('./../base');

utils = pi.utils;

pi.BaseView.Loadable = (function() {
  function Loadable() {}

  Loadable.included = function(klass) {
    return klass.requires('loader');
  };

  Loadable.prototype.loading = function(value) {
    if (value === true) {
      this.loader.reset();
      this.loader.start();
      return this.loader.simulate();
    } else if (value === false) {
      return this.loader.stop();
    }
  };

  return Loadable;

})();



},{"../../core":45,"./../base":81}],87:[function(require,module,exports){
'use strict';
var pi, utils, _app_rxp, _finder_rxp,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../plugins/plugin');

require('../../components/pieces');

utils = pi.utils;

_finder_rxp = /^(\w+)\.find\((\d+)\)$/;

_app_rxp = /^app\.([\.\w]+)$/;

pi.Base.Restful = (function(_super) {
  __extends(Restful, _super);

  function Restful() {
    return Restful.__super__.constructor.apply(this, arguments);
  }

  Restful.prototype.id = 'restful';

  Restful.prototype.initialize = function(target) {
    var matches, promise, resources, rest;
    this.target = target;
    Restful.__super__.initialize.apply(this, arguments);
    if (!this.target.has_renderable) {
      this.target.attach_plugin(pi.Base.Renderable);
    }
    if ((rest = this.target.options.rest) != null) {
      promise = (matches = rest.match(_app_rxp)) ? new Promise(function(resolve, reject) {
        var res;
        res = utils.get_path(pi.app, matches[1]);
        if (res) {
          return resolve(res);
        } else {
          return reject(res);
        }
      }) : (matches = rest.match(_finder_rxp)) ? (resources = utils.get_path($r, matches[1]), resources != null ? resources.find(matches[2] | 0) : new Promise(function(resolve, reject) {
        return reject();
      })) : void 0;
      promise.then((function(_this) {
        return function(resource) {
          return _this.bind(resource, !_this.target.firstChild);
        };
      })(this), (function(_this) {
        return function() {
          return utils.error("resource not found: " + rest);
        };
      })(this));
    }
  };

  Restful.prototype.bind = function(resource, render) {
    if (render == null) {
      render = false;
    }
    if (this.resource) {
      this.resource.off(this.resource_update());
    }
    this.resource = resource;
    this.resource.on('update', this.resource_update());
    if (render) {
      return this.target.render(resource);
    }
  };

  Restful.prototype.resource_update = function() {
    return this._resource_update || (this._resource_update = (function(_this) {
      return function(e) {
        utils.debug('Restful component event');
        return _this.on_update(e.currentTarget);
      };
    })(this));
  };

  Restful.prototype.on_update = function(data) {
    return this.target.render(data);
  };

  return Restful;

})(pi.Plugin);



},{"../../components/pieces":17,"../../core":45,"../../plugins/plugin":72}],88:[function(require,module,exports){
'use strict';
require('./base.restful');

require('./list.restful');



},{"./base.restful":87,"./list.restful":89}],89:[function(require,module,exports){
'use strict';
var pi, utils, _where_rxp,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

pi = require('../../core');

require('../../plugins/plugin');

require('../../components/base/list');

utils = pi.utils;

_where_rxp = /^(\w+)\.(where|find)\(([\w\s\,\:]+)\)(?:\.([\w]+))?$/i;

pi.List.Restful = (function(_super) {
  __extends(Restful, _super);

  function Restful() {
    return Restful.__super__.constructor.apply(this, arguments);
  }

  Restful.prototype.id = 'restful';

  Restful.prototype.initialize = function(list) {
    var el, key, matches, param, ref, resources, rest, val, _i, _len, _ref, _ref1;
    this.list = list;
    Restful.__super__.initialize.apply(this, arguments);
    this.items_by_id = {};
    this.listen_load = this.list.options.listen_load === true;
    if ((rest = this.list.options.rest) != null) {
      if ((matches = rest.match(_where_rxp))) {
        rest = matches[1];
        ref = $r[utils.camelCase(rest)];
        if (ref != null) {
          if (matches[2] === 'where') {
            resources = ref;
            this.scope = {};
            _ref = matches[3].split(/\s*\,\s*/);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              param = _ref[_i];
              _ref1 = param.split(/\s*\:\s*/), key = _ref1[0], val = _ref1[1];
              this.scope[key] = utils.serialize(val);
            }
          } else if (matches[2] === 'find') {
            el = ref.get(matches[3] | 0);
            if ((el != null) && typeof el[matches[4]] === 'function') {
              resources = el[matches[4]]();
            }
          }
        }
      } else {
        resources = $r[utils.camelCase(rest)];
      }
    }
    if (resources != null) {
      this.bind(resources, this.list.options.load_rest, this.scope);
    }
    this.list.delegate_to(this, 'find_by_id');
    this.list.on('destroyed', (function(_this) {
      return function() {
        _this.bind(null);
        return false;
      };
    })(this));
  };

  Restful.prototype.bind = function(resources, load, params) {
    var filter, matcher;
    if (load == null) {
      load = false;
    }
    if (this.resources) {
      this.resources.off(this.resource_update());
    }
    this.resources = resources;
    if (this.resources == null) {
      this.items_by_id = {};
      if (!this.list._disposed) {
        this.list.clear();
      }
      return;
    }
    if (params != null) {
      matcher = utils.matchers.object(params);
      filter = (function(_this) {
        return function(e) {
          if (e.data.type === 'load') {
            return true;
          }
          return matcher(e.data[_this.resources.resource_name]);
        };
      })(this);
    }
    this.resources.listen(this.resource_update(), filter);
    if (load) {
      if (params != null) {
        return this.load(resources.where(params));
      } else {
        return this.load(resources.all());
      }
    }
  };

  Restful.prototype.find_by_id = function(id) {
    var items;
    if (this.items_by_id[id] != null) {
      return this.items_by_id[id];
    }
    items = this.list.where({
      record: {
        id: id | 0
      }
    });
    if (items.length) {
      return this.items_by_id[id] = items[0];
    }
  };

  Restful.prototype.load = function(data) {
    var item, _i, _len;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      if (!(this.items_by_id[item.id] && this.listen_load)) {
        this.items_by_id[item.id] = this.list.add_item(item, true);
      }
    }
    return this.list.update();
  };

  Restful.prototype.resource_update = function() {
    return this._resource_update || (this._resource_update = (function(_this) {
      return function(e) {
        var _ref;
        utils.debug('Restful list event', e.data.type);
        return (_ref = _this["on_" + e.data.type]) != null ? _ref.call(_this, e.data[_this.resources.resource_name]) : void 0;
      };
    })(this));
  };

  Restful.prototype.on_load = function() {
    if (!this.listen_load) {
      return;
    }
    if (this.scope != null) {
      return this.load(this.resources.where(this.scope));
    } else {
      return this.load(this.resources.all());
    }
  };

  Restful.prototype.on_create = function(data) {
    if (!this.find_by_id(data.id)) {
      return this.items_by_id[data.id] = this.list.add_item(data);
    }
  };

  Restful.prototype.on_destroy = function(data) {
    var item;
    if ((item = this.find_by_id(data.id))) {
      this.list.remove_item(item);
      delete this.items_by_id[data.id];
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



},{"../../components/base/list":6,"../../core":45,"../../plugins/plugin":72}]},{},[58]);

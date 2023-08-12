mutiselect-bs4
==============
multiple select picker for Bootstrap 4

## Installation

### Dependencies
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/) v4
- [Font Awesome](https://fontawesome.com/) v5

### Manual

```html
<link href="/path/to/bootstrap.css" rel="stylesheet" />
<script src="/path/to/jquery.js"></script>
<script src="/path/to/bootstrap.js"></script>
<script src="/path/to/regular.js"></script>
<script src="/path/to/fontawesome.js"></script>
<script src="/path/to/multiselect-bs4.js"></script>
```

### Usage

```html
<div class="row justify-content-center">
<div class="form-group col-6">
<label for="color">Color:</label>
<select id="color" class="multiselect" name="color" multiple="multiple">
<option value="1">Red</option>
<option value="2">Orange</option>
<option value="3">Yellow</option>
<option value="4">Green</option>
<option value="5">Blue</option>
<option value="6">Indigo</option>
<option value="7">Violet</option>
<optgroup label="Reds">
<option value="8">Light Red</option>
<option value="9">Dark Red</option>
</optgroup>
</select>
</div>
</div>
```

```javascript
jQuery('.multiselect').multiselect();
```

## Options

| Option | Default | Description |
| --- | :---: | --- |
| `collapseOptGroupsByDefault` | `false` | When an optgroup exists in a select, collapse them. |
| `enableCaseSensitiveFiltering` | `false` | Enable case sensitive filtering when filtering is enabled. |
| `enableCollapsibleOptGroups` | `false` | Make optgroups collapsible. |
| `enableFiltering` | `false` | Enable a search filter to select options with. |
| `includeSelectAllOption` | `false` | Include an option to "Select All". This is typically disabled because the `includeSelectAllOptionMin` is normally used. |
| `includeSelectAllOptionMin` | `50` | Minimum number of options that trigger the "Select All" option be enabled. |
| `minScreenWidth` | `576` | Minimum screen width where multiselect is enabled. |
| `selectAllDeselectAll` | `false` | De-select all options if the "Select All" option is selected. |
| `selectAllText` | `'All'` | The text for "Sselect All" option. |
| `selectAllValue` | `''` | The value for the "Select All" option. |

## Methods

Methods are called using the the `multiselect` function with a string first argument for the option, followed by an optional second argument for the value. If no second argument is pased, then the value of the option is returned instead.

### Example
```javascript
// Get the minScreenWidth option
let minScreenWidth = jQuery('.multiselect').multiselect('minScreenWidth');

// Set the minScreenWidth option
jQuery('.multiselect').multiselect('minScreenWidth', 768);
```

## Demo

<a href="https://lesilent.github.io/multiselect-bs4">Online Demo</a>
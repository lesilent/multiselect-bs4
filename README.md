mutiselect-bs4
==============
multiple select picker for Bootstrap 4

## Installation

### Dependencies
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/docs/4.6/) v4
- [Font Awesome](https://fontawesome.com/v5/docs) v5

### Manual

```html
<link href="/path/to/bootstrap.css" rel="stylesheet" />
<script src="/path/to/jquery.js"></script>
<script src="/path/to/bootstrap.js"></script>
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
| `includeSelectAllOptionMin` | `false` | Minimum number of select options required to trigger the "Select All" option when `includeSelectAllOption` is used. |
| `selectAllDeselectAll` | `false` | De-select all options if the "Select All" option is selected. |
| `selectAllText` | `'All'` | The text for "Sselect All" option. |
| `selectAllValue` | `''` | The value for the "Select All" option. |

### Data Attributes

Options can be passed through JavaScript or via HTML data attributes. To use data attributes, `data-` is followed by the option name with the upper case letters replaced by a dash "`-`" followed by lower case version of the letter. For example, `includeSelectAllOption` becomes `data-include-select-all-option="true"`.

## Methods

Methods are called using the the `multiselect` function with a string first argument for the option, followed by an optional second argument for the value. If no second argument is pased, then the value of the option is returned instead.

### Example
```javascript
// Get the enableFiltering option
let enableFiltering = jQuery('.multiselect').multiselect('enableFiltering');

// Set the enableFiltering option
jQuery('.multiselect').multiselect('enableFiltering', true);
```

## Demo

<a href="https://lesilent.github.io/multiselect-bs4">Online Demo</a>
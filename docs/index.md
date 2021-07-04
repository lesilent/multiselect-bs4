# Documentation

A multiselect picker for Bootstrap 4.

optgroups are support.

---

## Installation

### Dependencies
- [jQuery](https://jquery.com/)
- [bootstrap](https://getbootstrap.com/) v4
- [fontawesome](https://fontawesome.com/) v5

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
<label for="color">Color:</label>
<select id="color" class="form-control" name="state" multiple="multiple">
<option value="1">Red</option>
<option value="2">Orange</option>
<option value="3">Yellow</option>
<option value="4">Green</option>
<option value="5">Blue</option>
<option value="6">Indigo</option>
<option value="7">Violet</option>
</select>
```

```javascript
jQuery('#my-multiselect').multiselect();
```

## Demo

<link rel="stylesheet" href="css/bootstrap.min.css" />
<script src="js/jquery.min.js" defer="defer"></script>
<script src="js/bootstrap.bundle.min.js" defer="defer"></script>
<script src="js/multiselect-bs4.js" defer="defer"></script>
<label for="color">Color:</label>
<select id="color" class="form-control" name="state" multiple="multiple">
<option value="1">Red</option>
<option value="2">Orange</option>
<option value="3">Yellow</option>
<option value="4">Green</option>
<option value="5">Blue</option>
<option value="6">Indigo</option>
<option value="7">Violet</option>
</select>
<script>
jQuery('#color').multiselect();
</script>

---

## Options

| Option | Default | Description |
| --- | --- | --- |
| ```collapseOptGroupsByDefault``` | ```true``` | When an optgroup exists in a select, collapse them. |
| ```enableCaseInsensitiveFiltering``` | ```true``` | Enable case insensitive filtering when filtering is enabled. |
| ```enableCollapsibleOptGroups``` | ```true``` | Make optgroups collapsible. |
| ```includeSelectAllOption``` | ```false``` | Include an option to "Select All". This is typically disabled because the ```includeSelectAllOptionMin``` is normally used. |
| ```includeSelectAllOptionMin``` | ```50``` | Minimum number of options that trigger the "Select All" option be enabled. |
| ```selectAllDeselectAll``` | ```false``` | De-select all options if the "Select All" option is selected. |
| ```selectAllText``` | ```'All'``` | The text for "Sselect All" option. |
| ```selectAllValue``` | ```''``` | The value for the "Select All" option. |

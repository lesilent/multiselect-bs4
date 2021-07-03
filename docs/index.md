# Documentation

A multiselect picker for Bootstrap 4.
optgroups are support.

---

## Installation

### Dependencies
- [jQuery](https://jquery.com/)
- [bootstrap](https://getbootstrap.com/) v4
- [fontawesome](https://fontawesome.com/) v5

```html
<link rel="stylesheet" href="/path/to/bootstrap.css" />
<script src="/path/to/jquery.js"></script>
<script src="/path/to/bootstrap.js"></script>
<script src="/path/to/fontawesome.js"></script>
<script src="/path/to/multiselect-bs4.js"></script>
```

### Usage

```javascript
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
jQuery('#my-multiselect').multiselect();
</script>
```

### Demo

<link rel="stylesheet" href="css/bootstrap.min.css" />
<script src="js/jquery.min.js" defer="defer"></script>
<script src="js/bootstrap.bundle.min.js" defer="defer"></script>
<script src="../src/multiselect-bs4.js" defer="defer"></script>
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
document.addEventListener('DOMContentLoaded', function() {
	jQuery('#color').multiselect({

	});
});
</script>

---

## Options

#### ```collapseOptGroupsByDefault```

When an optgroup exists in a select, collapse them.

---

#### enableCaseInsensitiveFiltering

default: ```true```

Enable case insensitive filtering when filtering is enabled.

---

#### enableCollapsibleOptGroups

default: ```true```

---

#### includeSelectAllOption

default: ```false```

Include an option to "Select All". This is typically disabled because the
```includeSelectAllOptionMin``` is normally used.

---

#### includeSelectAllOptionMin

default: ```50```

Minimum number of options that trigger the "Select All" option be enabled.

---

#### selectAllDeselectAll

default: ```false```

De-select all options if the "Select All" option is selected.

---

#### selectAllText

default: "All"

The text for "Sselect All" option.

---

#### selectAllValue

default: ```''```

Value for the "Select All" option.

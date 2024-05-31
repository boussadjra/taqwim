
<script setup>
import { toGregorian } from 'taqwim-core-utils';

const hijriDate2 = { hy: 1445, hm: 7, hd: 1 };

const gregorianDate2 = toGregorian(hijriDate2);
</script>

## Convert Hijri date to Gregorian date

```js
import { toGregorian } from 'taqwim-core-utils';

const hijriDate = { hy: 1445, hm: 7, hd: 1 };

const gregorianDate = toGregorian(hijriDate);
```

output : 

    {{ gregorianDate2 }}







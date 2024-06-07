<script setup>
import { toHijri } from 'taqwim-core-utils';
const gregorianDate = new Date('2024-03-11');

const hijriDate = toHijri(gregorianDate); 

</script>

## Convert Gregorian date to Hijri date

```js
import { toHijri } from 'taqwim-core-utils'
const gregorianDate = new Date('2024-03-11')

const hijriDate = toHijri(gregorianDate)
```

output :

    {{ hijriDate }}

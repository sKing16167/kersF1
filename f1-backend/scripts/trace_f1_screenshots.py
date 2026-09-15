import os
import numpy as np
from PIL import Image
from scipy.interpolate import splprep, splev

SCREENSHOTS = {
    'monza': r'C:\Users\ksaha\.gemini\antigravity\brain\8f6e391f-2e9c-44f9-acfd-e090908398a1\.user_uploaded\media_1789275070298.png',
    'spa': r'C:\Users\ksaha\.gemini\antigravity\brain\8f6e391f-2e9c-44f9-acfd-e090908398a1\.user_uploaded\media_1789275100944.png',
    'silverstone': r'C:\Users\ksaha\.gemini\antigravity\brain\8f6e391f-2e9c-44f9-acfd-e090908398a1\.user_uploaded\media_1789275140271.png',
    'monaco': r'C:\Users\ksaha\.gemini\antigravity\brain\8f6e391f-2e9c-44f9-acfd-e090908398a1\.user_uploaded\media_1789275193920.png',
    'suzuka': r'C:\Users\ksaha\.gemini\antigravity\brain\8f6e391f-2e9c-44f9-acfd-e090908398a1\.user_uploaded\media_1789275220556.png',
}

print('Tracer script initialized')

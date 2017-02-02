#!/usr/bin/env python
# -*- coding:  utf-8 -*-

import random
import json

from railnation.core.common import log
from railnation.core.server import server
from railnation.core.errors import RailNationInitializationError


class PropertiesManager:
    """
    Game properties.

    """

    instance = None

    @staticmethod
    def get_instance():
        """
        :rtype: PropertiesManager
        """
        if PropertiesManager.instance is None:
            PropertiesManager.instance = PropertiesManager()

        return PropertiesManager.instance

    def __init__(self):
        self.log = log.getChild('PropertiesManager')
        self.log.debug('Initializing...')

        self.buildings = {}

        data = server.call('ServerInfoInterface', 'getInfo', [])

        self.config_path = data['config']
        self.log.debug('Config path: %s' % self.config_path)
        self.game_speed = data['gameSpeed'] if 'gameSpeed' in data.keys() else 1
        self.log.debug('Game speed: %s' % self.game_speed)
        self.map_file = data['map']
        self.log.debug('Map file: %s' % self.map_file)
        self.town_name_offset = data['townNameOffset']
        self.log.debug('Town names offset: %s' % self.town_name_offset)
        self.town_name_pack = data['townNamePackage']
        self.log.debug('Town names package: %s' % self.town_name_pack)
        self.version = data['version']
        self.log.debug('Game version: %s' % self.version)
        self.world_name = data['worldName']
        self.log.debug('World name: %s' % self.world_name)

    def load_station_buildings(self):
        for i, b in enumerate((
            'engine_house',
            'station',
            'maintenance_hall',
            'construction_yard',
            'bank',
            'licence',
            'labor',
            'hotel',
            'restaurant',
            'mall',
        )):
            url = '/properties/%s/building_%s.json?%s' % (
                self.config_path, b, random.random()
            )
            self.log.debug('Loading: %s' % url)
            r = server.get(url)
            self.log.debug('Raw data: %s' % r)
            self.buildings[i] = json.loads(r)

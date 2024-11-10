import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/createTrack.dto';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/updateTrack.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {
    this.trackService = trackService;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): Track {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Track[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string): Track {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Track {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.trackService.delete(id);
  }
}

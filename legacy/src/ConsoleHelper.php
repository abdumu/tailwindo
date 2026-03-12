<?php

namespace Awssat\Tailwindo;

use Symfony\Component\Console\Output\OutputInterface;

class ConsoleHelper
{
    /** @var \Awssat\Tailwindo\Converter */
    protected $converter;

    protected $output;
    protected $recursive = false;
    protected $overwrite;
    protected $extensions;
    protected $components = false;
    protected $folderConvert = false;

    public function __construct(OutputInterface $output, array $settings)
    {
        $this->converter = (new Converter())
                                ->setFramework($settings['framework'] ?? 'bootstrap')
                                ->setGenerateComponents($settings['components'] ?? false)
                                ->setPrefix($settings['prefix'] ?? '');

        $this->output = $output;
        $this->recursive = $settings['recursive'] ?? false;
        $this->overwrite = $settings['overwrite'] ?? false;
        $this->extensions = $settings['extensions'] ?? 'php,html';
        $this->components = $settings['components'] ?? false;
        $this->folderConvert = $settings['folderConvert'] ?? false;
    }

    public function folderConvert(string $folderPath)
    {
        [$frameworkVersion, $TailwindVersion] = $this->converter->getFramework()->supportedVersion();

        $this->output->writeln('<fg=black;bg=blue>Converting Folder'.($this->components ? ' (extracted to tailwindo-components.css)' : '').':</> '.realpath($folderPath));
        $this->output->writeln(
            '<fg=black;bg=green>Converting from</> '.$this->converter->getFramework()->frameworkName().' '.
                        $frameworkVersion.' <fg=black;bg=green> to </> Tailwind '.$TailwindVersion
        );

        if ($this->recursive) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator(
                    $folderPath,
                    \RecursiveDirectoryIterator::SKIP_DOTS
                ),
                \RecursiveIteratorIterator::SELF_FIRST,
                \RecursiveIteratorIterator::CATCH_GET_CHILD
            );
        } else {
            $iterator = new \DirectoryIterator($folderPath);
        }

        if ($this->folderConvert && $this->components) {
            $this->newComponentsFile(realpath($folderPath));
        }

        foreach ($iterator as $_ => $directory) {
            $extensions = explode('.', $directory);
            $extension = end($extensions);
            if ($directory->isFile() && $this->isConvertibleFile($extension)) {
                $this->fileConvert($directory->getRealPath());
            }
        }
    }

    public function fileConvert($filePath)
    {
        //just in case
        $filePath = realpath($filePath);

        if (!$this->folderConvert) {
            $this->output->writeln('<fg=black;bg=blue>Converting FIle: '.($this->components ? '(extracted to tailwindo-components.css)' : '').'</> '.$filePath);

            [$frameworkVersion, $TailwindVersion] = $this->converter->getFramework()->supportedVersion();
            $this->output->writeln(
                '<fg=black;bg=green>Converting from</> '.$this->converter->getFramework()->frameworkName().' '.
                $frameworkVersion.' <fg=black;bg=green> to </> Tailwind '.$TailwindVersion.PHP_EOL
            );
        }

        if (!is_file($filePath)) {
            $this->output->writeln('<comment>Couldn\'t convert: </comment>'.basename($filePath));

            return;
        }

        $content = file_get_contents($filePath);

        $lastDotPosition = strrpos($filePath, '.');

        if ($lastDotPosition !== false && !$this->overwrite) {
            $newFilePath = substr_replace($filePath, '.tw', $lastDotPosition, 0);
        } elseif (!$this->overwrite) {
            $newFilePath = $filePath.'.tw';
        } else {
            // Set the new path to the old path to make sure we overwrite it
            $newFilePath = $filePath;
        }

        $newContent = $this->converter
                    ->setContent($content)
                    ->convert()
                    ->get($this->components);

        if ($content !== $newContent) {
            $this->output->writeln('<info>processed: </info>'.basename($newFilePath));

            if ($this->components) {
                if (!$this->folderConvert) {
                    $this->newComponentsFile(dirname($filePath));
                }

                $this->writeComponentsToFile($newContent, dirname($filePath));
            } else {
                file_put_contents($newFilePath, $newContent);
            }
        } else {
            $this->output->writeln('<comment>Nothing to convert: </comment>'.basename($filePath));
        }
    }

    public function codeConvert(?string $code)
    {
        $convertedCode = $this->converter
                    ->setContent($code)
                    ->classesOnly(strpos($code, '<') === false && strpos($code, '>') === false)
                    ->convert()
                    ->get($this->components);

        if (!empty($convertedCode)) {
            $this->output->writeln('<info>Converted Code: </info>'.$convertedCode);
        } else {
            $this->output->writeln('<comment>Nothing generated! It means that TailwindCSS has no equivalent for that classes,'.
                    'or it has exactly classes with the same name.</comment>');
        }
    }

    /**
     * Check whether a file is convertible or not based on its extension.
     */
    protected function isConvertibleFile(string $extension): bool
    {
        return in_array($extension, $this->extensions);
    }

    protected function writeComponentsToFile($code, $path)
    {
        $cssFilePath = $path.'/tailwindo-components.css';

        file_put_contents($cssFilePath, $code.PHP_EOL, FILE_APPEND);
    }

    protected function newComponentsFile($path)
    {
        $cssFilePath = $path.'/tailwindo-components.css';

        if (file_exists($cssFilePath)) {
            unlink($cssFilePath);
        }

        file_put_contents($cssFilePath, '/** Auto-generated by Tailwindo: '.date('d-m-Y')." */\n\n");
    }
}
